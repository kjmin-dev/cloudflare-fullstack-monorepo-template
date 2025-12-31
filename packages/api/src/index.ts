import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

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

export default app;
