import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { todos } from '../../db/schema';
import type { AppEnv } from '../../types';
import {
  CreateTodoBodySchema,
  ErrorResponseSchema,
  SuccessMessageSchema,
  TodoIdParamSchema,
  TodoListSchema,
  TodoSchema,
  UpdateTodoBodySchema,
  UserIdParamSchema,
} from './todos.schemas';

// =============================================================================
// Router
// =============================================================================

const todosRouter = new OpenAPIHono<AppEnv>();

// =============================================================================
// Routes
// =============================================================================

const listTodos = createRoute({
  method: 'get',
  path: '/users/{userId}/todos',
  tags: ['Todos'],
  summary: 'List all todos',
  description: 'Retrieves all todos belonging to the specified user',
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: TodoListSchema } },
      description: 'List of todos',
    },
  },
});

const getTodo = createRoute({
  method: 'get',
  path: '/users/{userId}/todos/{id}',
  tags: ['Todos'],
  summary: 'Get a todo',
  description: 'Retrieves a specific todo by its ID',
  request: {
    params: TodoIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: TodoSchema } },
      description: 'The requested todo',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Todo not found',
    },
  },
});

const createTodo = createRoute({
  method: 'post',
  path: '/users/{userId}/todos',
  tags: ['Todos'],
  summary: 'Create a todo',
  description: 'Creates a new todo for the specified user',
  request: {
    params: UserIdParamSchema,
    body: {
      content: { 'application/json': { schema: CreateTodoBodySchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: TodoSchema } },
      description: 'The created todo',
    },
    400: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Invalid request body',
    },
  },
});

const updateTodo = createRoute({
  method: 'patch',
  path: '/users/{userId}/todos/{id}',
  tags: ['Todos'],
  summary: 'Update a todo',
  description: 'Updates an existing todo with the provided fields',
  request: {
    params: TodoIdParamSchema,
    body: {
      content: { 'application/json': { schema: UpdateTodoBodySchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: TodoSchema } },
      description: 'The updated todo',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Todo not found',
    },
  },
});

const deleteTodo = createRoute({
  method: 'delete',
  path: '/users/{userId}/todos/{id}',
  tags: ['Todos'],
  summary: 'Delete a todo',
  description: 'Deletes a specific todo by its ID',
  request: {
    params: TodoIdParamSchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SuccessMessageSchema } },
      description: 'Todo deleted successfully',
    },
    404: {
      content: { 'application/json': { schema: ErrorResponseSchema } },
      description: 'Todo not found',
    },
  },
});

// =============================================================================
// Handlers
// =============================================================================

todosRouter.openapi(listTodos, async (c) => {
  const { userId } = c.req.valid('param');
  const db = drizzle(c.env.D1_DB);

  const userTodos = await db.select().from(todos).where(eq(todos.userId, userId));

  return c.json(userTodos, 200);
});

todosRouter.openapi(getTodo, async (c) => {
  const { userId, id } = c.req.valid('param');
  const db = drizzle(c.env.D1_DB);

  const [todo] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json(todo, 200);
});

todosRouter.openapi(createTodo, async (c) => {
  const { userId } = c.req.valid('param');
  const { title } = c.req.valid('json');
  const db = drizzle(c.env.D1_DB);

  const [newTodo] = await db
    .insert(todos)
    .values({
      userId,
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return c.json(newTodo, 201);
});

todosRouter.openapi(updateTodo, async (c) => {
  const { userId, id } = c.req.valid('param');
  const body = c.req.valid('json');
  const db = drizzle(c.env.D1_DB);

  const [existing] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (!existing) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  const [updatedTodo] = await db
    .update(todos)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.completed !== undefined && { completed: body.completed }),
      updatedAt: new Date(),
    })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)))
    .returning();

  return c.json(updatedTodo, 200);
});

todosRouter.openapi(deleteTodo, async (c) => {
  const { userId, id } = c.req.valid('param');
  const db = drizzle(c.env.D1_DB);

  const [existing] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (!existing) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));

  return c.json({ message: 'Todo deleted successfully' }, 200);
});

export { todosRouter };
