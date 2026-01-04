import { z } from '@hono/zod-openapi';

// =============================================================================
// Path Parameters
// =============================================================================

export const UserIdParamSchema = z.object({
  userId: z.string().openapi({
    param: { name: 'userId', in: 'path' },
    example: 'user-123',
    description: 'The unique identifier of the user',
  }),
});

export const TodoIdParamSchema = z.object({
  userId: z.string().openapi({
    param: { name: 'userId', in: 'path' },
    example: 'user-123',
    description: 'The unique identifier of the user',
  }),
  id: z
    .string()
    .transform((val) => Number(val))
    .openapi({
      param: { name: 'id', in: 'path' },
      example: '1',
      description: 'The unique identifier of the todo',
    }),
});

// =============================================================================
// Request Body Schemas
// =============================================================================

export const CreateTodoBodySchema = z
  .object({
    title: z.string().min(1).openapi({
      example: 'Buy groceries',
      description: 'The title of the todo',
    }),
  })
  .openapi('CreateTodoRequest');

export const UpdateTodoBodySchema = z
  .object({
    title: z.string().min(1).optional().openapi({
      example: 'Buy groceries',
      description: 'The updated title of the todo',
    }),
    completed: z.boolean().optional().openapi({
      example: true,
      description: 'The completion status of the todo',
    }),
  })
  .openapi('UpdateTodoRequest');

// =============================================================================
// Response Schemas
// =============================================================================

export const TodoSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    userId: z.string().openapi({ example: 'user-123' }),
    title: z.string().openapi({ example: 'Buy groceries' }),
    completed: z.boolean().openapi({ example: false }),
    createdAt: z.union([z.string(), z.date()]).openapi({ example: '2024-01-01T00:00:00.000Z' }),
    updatedAt: z.union([z.string(), z.date()]).openapi({ example: '2024-01-01T00:00:00.000Z' }),
  })
  .openapi('Todo');

export const TodoListSchema = z.array(TodoSchema).openapi('TodoList');

export const ErrorResponseSchema = z
  .object({
    error: z.string().openapi({ example: 'Todo not found' }),
  })
  .openapi('ErrorResponse');

export const SuccessMessageSchema = z
  .object({
    message: z.string().openapi({ example: 'Todo deleted successfully' }),
  })
  .openapi('SuccessMessage');
