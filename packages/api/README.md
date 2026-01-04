# api

Hono API deployed to Cloudflare Workers.

> See [root README](../../README.md) for development and deployment commands.

## API Documentation

Auto-generated API documentation powered by OpenAPI 3.1.

| Endpoint | Description |
|----------|-------------|
| `/docs` | Scalar API Reference UI |
| `/openapi.json` | OpenAPI specification JSON |

### Tech Stack

- **[@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)**: OpenAPI route definitions with Zod schemas
- **[@scalar/hono-api-reference](https://github.com/scalar/scalar)**: API documentation UI
- **[Zod](https://zod.dev)**: Runtime validation + type inference

### Project Structure

```
src/
├── index.ts                      # Composition root (middleware, OpenAPI config)
├── types.ts                      # Shared types (AppEnv, Bindings)
├── db/
│   └── schema.ts                 # Drizzle ORM schema
└── modules/
    └── todos/
        ├── index.ts              # Router + Route definitions + Handlers
        └── todos.schemas.ts      # Zod schemas
```

### Adding New Module

```ts
// src/modules/users/index.ts
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import type { AppEnv } from '../../types';
import { UserSchema } from './users.schemas';

const usersRouter = new OpenAPIHono<AppEnv>();

const getUser = createRoute({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  // ... route definition
});

usersRouter.openapi(getUser, async (c) => {
  // handler implementation
});

export { usersRouter };
```

```ts
// src/index.ts
import { usersRouter } from './modules/users';

app.route('/', usersRouter);
```

## Generate Cloudflare Types

```bash
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
