import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { todos } from './db/schema';

type Bindings = {
  D1_DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  '*',
  cors({
    origin: ['http://localhost:5173', 'https://webapp-3ls.pages.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Get all todos for a user
app.get('/users/:userId/todos', async (c) => {
  const userId = c.req.param('userId');
  const db = drizzle(c.env.D1_DB);

  const userTodos = await db.select().from(todos).where(eq(todos.userId, userId));

  return c.json(userTodos);
});

// Get a single todo
app.get('/users/:userId/todos/:id', async (c) => {
  const userId = c.req.param('userId');
  const id = Number(c.req.param('id'));
  const db = drizzle(c.env.D1_DB);

  const [todo] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (!todo) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  return c.json(todo);
});

// Create a new todo
app.post('/users/:userId/todos', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json<{ title: string }>();
  const db = drizzle(c.env.D1_DB);

  if (!body.title) {
    return c.json({ error: 'Title is required' }, 400);
  }

  const [newTodo] = await db
    .insert(todos)
    .values({
      userId,
      title: body.title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return c.json(newTodo, 201);
});

// Update a todo
app.patch('/users/:userId/todos/:id', async (c) => {
  const userId = c.req.param('userId');
  const id = Number(c.req.param('id'));
  const body = await c.req.json<{ title?: string; completed?: boolean }>();
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

  return c.json(updatedTodo);
});

// Delete a todo
app.delete('/users/:userId/todos/:id', async (c) => {
  const userId = c.req.param('userId');
  const id = Number(c.req.param('id'));
  const db = drizzle(c.env.D1_DB);

  const [existing] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  if (!existing) {
    return c.json({ error: 'Todo not found' }, 404);
  }

  await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));

  return c.json({ message: 'Todo deleted successfully' });
});

export default app;
