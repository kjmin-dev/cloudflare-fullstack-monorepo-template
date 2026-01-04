import type { CreateTodoRequest, Todo, UpdateTodoRequest } from '../../types/todo';
import { api } from './client';

export async function fetchTodos(userId: string): Promise<Todo[]> {
  const response = await api.get<Todo[]>(`/users/${userId}/todos`);
  return response.data;
}

export async function createTodo(userId: string, data: CreateTodoRequest): Promise<Todo> {
  const response = await api.post<Todo>(`/users/${userId}/todos`, data);
  return response.data;
}

export async function updateTodo(userId: string, todoId: number, data: UpdateTodoRequest): Promise<Todo> {
  const response = await api.patch<Todo>(`/users/${userId}/todos/${todoId}`, data);
  return response.data;
}

export async function deleteTodo(userId: string, todoId: number): Promise<void> {
  await api.delete(`/users/${userId}/todos/${todoId}`);
}
