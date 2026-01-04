# cloudflare-fullstack-monorepo-template

🚧 **Under Development** - This template is not yet complete.

A monorepo template for a Cloudflare Workers backend with a React webapp.

## Demo

- React Webapp: https://webapp-3ls.pages.dev
- Hono API: https://api.kjmin-dev-cf-playground.workers.dev

## Prerequisites

Install dependencies:

```bash
bun install
```

Setup wrangler (requires Cloudflare account):

```bash
bunx wrangler login
```

## Development

Run all packages in parallel with TUI:

```bash
bun run dev
```

Run individual packages:

```bash
bun run webapp dev   # Webapp only
bun run api dev      # API only
```

## Build & Deploy

```bash
# Build all packages
bun run build

# Deploy all packages
bun run deploy

# Deploy individual packages
bun run webapp deploy
bun run api deploy
```

## D1 Database Setup

Create D1 databases:

```bash
bunx wrangler d1 create d1_dev
bunx wrangler d1 create d1_prod
```

Update `packages/api/wrangler.jsonc` with the returned `database_id` values.

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

## Linting & Formatting

```bash
bun run lint      # Check lint errors
bun run format    # Format code
```
