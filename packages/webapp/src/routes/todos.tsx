import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClipboardIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PlusIcon,
  RefreshIcon,
  SparklesIcon,
  TrashIcon,
} from '../components/icons';
import { Avatar, Button, Card, Checkbox, IconButton, Input, Progress, Tooltip } from '../components/ui';
import { formatFullDateTime, formatTime } from '../lib/formatTime';
import {
  selectCompletedCount,
  selectError,
  selectIsAdding,
  selectIsAllComplete,
  selectIsDeleting,
  selectIsLoading,
  selectIsToggling,
  selectTodos,
  useTodoStore,
} from '../stores/todoStore';
import type { Todo } from '../types/todo';

const USER_ID_KEY = 'todo_user_id';

export const Route = createFileRoute('/todos')({
  component: TodoListPage,
});

function TodoItem({ todo }: { todo: Todo }) {
  const { t } = useTranslation();
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);
  const isToggling = useTodoStore(selectIsToggling(todo.id));
  const isDeleting = useTodoStore(selectIsDeleting(todo.id));
  const isDisabled = isToggling || isDeleting;

  return (
    <Card
      variant="default"
      padding="none"
      className={`group p-4 hover:shadow-md dark:hover:shadow-black/10 transition-all duration-200 ${isDisabled ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        <Checkbox checked={todo.completed} onChange={() => toggleTodo(todo)} disabled={isDisabled} className="mt-0.5" />

        <div className="flex-1 min-w-0">
          <p
            className={`text-base transition-all duration-200 ${
              todo.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'
            }`}>
            {todo.title}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
            <Tooltip content={t('todos.createdAt', { time: formatFullDateTime(todo.createdAt) })}>
              <span className="flex items-center gap-1 cursor-default">
                <ClockIcon className="w-3 h-3" />
                {formatTime(todo.createdAt, t)}
              </span>
            </Tooltip>
            {todo.createdAt !== todo.updatedAt && (
              <Tooltip content={t('todos.updatedAt', { time: formatFullDateTime(todo.updatedAt) })}>
                <span className="flex items-center gap-1 cursor-default">
                  <RefreshIcon className="w-3 h-3" />
                  {formatTime(todo.updatedAt, t)}
                </span>
              </Tooltip>
            )}
          </div>
        </div>

        <IconButton
          variant="danger"
          size="sm"
          label="Delete"
          onClick={() => removeTodo(todo.id)}
          disabled={isDisabled}
          className="opacity-0 group-hover:opacity-100 disabled:opacity-50">
          <TrashIcon className="w-4 h-4" />
        </IconButton>
      </div>
    </Card>
  );
}

function TodoListPage() {
  const { t } = useTranslation();
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem(USER_ID_KEY);

  // Zustand store
  const todos = useTodoStore(selectTodos);
  const isLoading = useTodoStore(selectIsLoading);
  const isAdding = useTodoStore(selectIsAdding);
  const error = useTodoStore(selectError);
  const completedCount = useTodoStore(selectCompletedCount);
  const isAllComplete = useTodoStore(selectIsAllComplete);

  const setUserId = useTodoStore((state) => state.setUserId);
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const addTodo = useTodoStore((state) => state.addTodo);
  const reset = useTodoStore((state) => state.reset);

  useEffect(() => {
    if (!userId) {
      navigate({ to: '/' });
      return;
    }

    setUserId(userId);
    fetchTodos();

    return () => {
      reset();
    };
  }, [userId, navigate, setUserId, fetchTodos, reset]);

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 dark:border-violet-900 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    await addTodo(title);
    setNewTitle('');
  }

  function handleLogout() {
    localStorage.removeItem(USER_ID_KEY);
    reset();
    navigate({ to: '/' });
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card variant="elevated" padding="md" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={userId} size="md" />
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">{userId}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('todos.greeting')}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t('todos.logout')}
            </Button>
          </div>

          {/* Progress */}
          {todos.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">{t('todos.progress')}</span>
                {isAllComplete ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                    <SparklesIcon className="w-4 h-4" />
                    {t('todos.allCompleted')}
                  </span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {t('todos.completed', { count: completedCount, total: todos.length })}
                  </span>
                )}
              </div>
              <Progress value={completedCount} max={todos.length} isComplete={isAllComplete} />
            </div>
          )}
        </Card>

        {/* Error */}
        {error && (
          <Card
            variant="outlined"
            padding="sm"
            className="mb-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          </Card>
        )}

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={t('todos.addPlaceholder')}
              hasGlow
              wrapperClassName="flex-1"
              disabled={isAdding}
            />
            <Button
              type="submit"
              disabled={!newTitle.trim() || isAdding}
              isLoading={isAdding}
              size="md"
              className="px-5">
              <PlusIcon className="w-5 h-5" />
            </Button>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card variant="default" padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <ClipboardIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">{t('todos.emptyTitle')}</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">{t('todos.emptyDescription')}</p>
            </Card>
          ) : (
            todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
          )}
        </div>
      </div>
    </div>
  );
}
