import { OpenAPIHono } from '@hono/zod-openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { todosRouter } from './modules/todos';
import type { AppEnv } from './types';

// =============================================================================
// App
// =============================================================================

const app = new OpenAPIHono<AppEnv>();

// =============================================================================
// Middleware
// =============================================================================

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

// =============================================================================
// Routes
// =============================================================================

app.get('/', (c) => c.text('Hello Hono!'));

app.route('/', todosRouter);

// =============================================================================
// OpenAPI
// =============================================================================

app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Cloudflare Todo Demo API',
    version: '1.0.0',
    description:
      'A demo Todo API built with Hono, Drizzle ORM, and Cloudflare Workers + D1',
  },
});

app.get(
  '/docs',
  Scalar({
    theme: 'alternate',
    url: '/openapi.json',
    pageTitle: 'Cloudflare Todo Demo API',
  }),
);

export default app;
