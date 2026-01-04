# cloudflare-fullstack-monorepo-template

🚧 **Under Development** - This template is not yet complete.

A monorepo template for a Cloudflare Workers backend with a React webapp.

## Demo Url

- React Webapp: https://webapp-3ls.pages.dev
- Hono API: https://api.kjmin-dev-cf-playground.workers.dev

## Prerequisites

To install dependencies:

```bash
bun i
```

Setup wrangler (You need to have a Cloudflare account)
```bash
bun wrangler login
```

## D1 Database Setup

Create D1 databases for development and production:

```bash
# Create databases
bunx wrangler d1 create d1_dev
bunx wrangler d1 create d1_prod
```

Each command will output a `database_id`. Update `packages/api/wrangler.jsonc` with these IDs:

```jsonc
// For development (root level d1_databases)
"database_id": "<YOUR_D1_DEV_DATABASE_ID>"

// For production (env.production.d1_databases)
"database_id": "<YOUR_D1_PROD_DATABASE_ID>"
```

Apply migrations:

```bash
cd packages/api

# Local development
bunx wrangler d1 migrations apply D1_DB

# Remote development
bunx wrangler d1 migrations apply D1_DB --remote

# Production
bunx wrangler d1 migrations apply D1_DB --env production --remote
```

## Getting Started (from monorepo root)

Run API development server
```bash
bun api dev
```

Deploy API
```bash
bun api deploy
```

Run Webapp development server
```bash
bun webapp dev
```

Deploy Webapp
```bash
bun webapp deploy
```

This project was created using `bun init` in bun v1.3.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
