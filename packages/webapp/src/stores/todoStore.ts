import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from '../lib/api';
import { ApiError } from '../lib/api/types';
import type { Todo } from '../types/todo';

interface TodoState {
  // Data
  todos: Todo[];
  userId: string | null;

  // Loading states
  isLoading: boolean;
  isAdding: boolean;
  pendingToggles: Set<number>;
  pendingDeletes: Set<number>;

  // Error
  error: string | null;
  isLimitExceeded: boolean;
  todoLimit: number | null;
}

interface TodoActions {
  // Initialization
  setUserId: (userId: string | null) => void;
  fetchTodos: () => Promise<void>;

  // CRUD
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;

  // Utils
  clearError: () => void;
  clearLimitExceeded: () => void;
  reset: () => void;
}

type TodoStore = TodoState & TodoActions;

const initialState: TodoState = {
  todos: [],
  userId: null,
  isLoading: false,
  isAdding: false,
  pendingToggles: new Set(),
  pendingDeletes: new Set(),
  error: null,
  isLimitExceeded: false,
  todoLimit: null,
};

export const useTodoStore = create<TodoStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUserId: (userId) => {
        set({ userId, todos: [], error: null }, false, 'setUserId');
      },

      fetchTodos: async () => {
        const { userId, isLoading } = get();
        if (!userId || isLoading) return;

        set({ isLoading: true, error: null }, false, 'fetchTodos/pending');

        try {
          const todos = await fetchTodos(userId);
          set({ todos, isLoading: false }, false, 'fetchTodos/fulfilled');
        } catch {
          set({ error: 'Failed to fetch todos', isLoading: false }, false, 'fetchTodos/rejected');
        }
      },

      addTodo: async (title) => {
        const { userId, isAdding } = get();
        if (!userId || isAdding) return;

        set({ isAdding: true }, false, 'addTodo/pending');

        try {
          const newTodo = await createTodo(userId, { title });
          set((state) => ({ todos: [...state.todos, newTodo], isAdding: false }), false, 'addTodo/fulfilled');
        } catch (err) {
          if (ApiError.isApiError(err) && err.code === 'TODO_LIMIT_EXCEEDED') {
            const limit = typeof err.extensions?.limit === 'number' ? err.extensions.limit : null;
            set({ isLimitExceeded: true, todoLimit: limit, isAdding: false }, false, 'addTodo/limitExceeded');
          } else {
            set({ error: 'Failed to add todo', isAdding: false }, false, 'addTodo/rejected');
          }
        }
      },

      toggleTodo: async (todo) => {
        const { userId, pendingToggles } = get();
        if (!userId || pendingToggles.has(todo.id)) return;

        set({ pendingToggles: new Set(pendingToggles).add(todo.id) }, false, `toggleTodo/pending/${todo.id}`);

        try {
          const updated = await updateTodo(userId, todo.id, { completed: !todo.completed });
          set(
            (state) => {
              const next = new Set(state.pendingToggles);
              next.delete(todo.id);
              return {
                todos: state.todos.map((t) => (t.id === todo.id ? updated : t)),
                pendingToggles: next,
              };
            },
            false,
            `toggleTodo/fulfilled/${todo.id}`,
          );
        } catch {
          set(
            (state) => {
              const next = new Set(state.pendingToggles);
              next.delete(todo.id);
              return { error: 'Failed to update todo', pendingToggles: next };
            },
            false,
            `toggleTodo/rejected/${todo.id}`,
          );
        }
      },

      removeTodo: async (id) => {
        const { userId, pendingDeletes } = get();
        if (!userId || pendingDeletes.has(id)) return;

        set({ pendingDeletes: new Set(pendingDeletes).add(id) }, false, `removeTodo/pending/${id}`);

        try {
          await deleteTodo(userId, id);
          set(
            (state) => {
              const next = new Set(state.pendingDeletes);
              next.delete(id);
              return {
                todos: state.todos.filter((t) => t.id !== id),
                pendingDeletes: next,
              };
            },
            false,
            `removeTodo/fulfilled/${id}`,
          );
        } catch {
          set(
            (state) => {
              const next = new Set(state.pendingDeletes);
              next.delete(id);
              return { error: 'Failed to delete todo', pendingDeletes: next };
            },
            false,
            `removeTodo/rejected/${id}`,
          );
        }
      },

      clearError: () => set({ error: null }, false, 'clearError'),

      clearLimitExceeded: () => set({ isLimitExceeded: false }, false, 'clearLimitExceeded'),

      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'TodoStore',
      enabled: process.env.NODE_ENV !== 'production',
      serialize: {
        replacer: (_key: string, value: unknown) => (value instanceof Set ? [...value] : value),
      },
    },
  ),
);

// Custom hooks
export const useTodos = () => useTodoStore((state) => state.todos);
export const useIsLoading = () => useTodoStore((state) => state.isLoading);
export const useIsAdding = () => useTodoStore((state) => state.isAdding);
export const useTodoError = () => useTodoStore((state) => state.error);
export const useIsLimitExceeded = () => useTodoStore((state) => state.isLimitExceeded);
export const useTodoLimit = () => useTodoStore((state) => state.todoLimit);
export const useIsToggling = (id: number) => useTodoStore((state) => state.pendingToggles.has(id));
export const useIsDeleting = (id: number) => useTodoStore((state) => state.pendingDeletes.has(id));
export const useCompletedCount = () => useTodoStore((state) => state.todos.filter((t) => t.completed).length);
export const useIsAllComplete = () =>
  useTodoStore((state) => state.todos.length > 0 && state.todos.every((t) => t.completed));

export const useTodoActions = () =>
  useTodoStore(
    useShallow((state) => ({
      setUserId: state.setUserId,
      fetchTodos: state.fetchTodos,
      addTodo: state.addTodo,
      toggleTodo: state.toggleTodo,
      removeTodo: state.removeTodo,
      clearError: state.clearError,
      clearLimitExceeded: state.clearLimitExceeded,
      reset: state.reset,
    })),
  );
