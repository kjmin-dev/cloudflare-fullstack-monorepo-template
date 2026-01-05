---
description: Cloudflare fullstack monorepo with Bun
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

## Project Structure

Monorepo with two packages:

- `packages/api` - Cloudflare Workers API
  - Hono + Zod OpenAPI for routing and validation
  - Drizzle ORM + Cloudflare D1 (SQLite) for database
  - Scalar for API documentation (`/docs`)
- `packages/webapp` - React SPA on Cloudflare Pages
  - React 19 + TanStack Router for routing
  - Zustand for state management
  - Tailwind CSS v4 for styling
  - i18next for i18n (en/ko/ja)

## Commands

```sh
bun run dev          # Start both API and webapp (turbo)
bun api dev          # Start API only (wrangler dev)
bun webapp dev       # Start webapp only (vite)
bun run tsc          # Type check all packages
```

## Database (Drizzle + D1)

Schema defined in `packages/api/src/db/schema.ts`. To add/modify tables:

```sh
# Generate migration after schema change
bun api drizzle-kit generate

# Apply migration to local D1
bun api wrangler d1 execute DB --local --file=drizzle/<migration>.sql

# Apply migration to production D1
bun api wrangler d1 execute DB --remote --file=drizzle/<migration>.sql
```

## API Structure

- Entry: `packages/api/src/app.ts`
- Routes: `packages/api/src/modules/<feature>/<feature>.routes.ts`
- Schemas: `packages/api/src/modules/<feature>/<feature>.schemas.ts`
- DB Schema: `packages/api/src/db/schema.ts`

## Webapp Structure

- Routes: `packages/webapp/src/routes/*.tsx` (file-based routing)
- Components: `packages/webapp/src/components/ui/*.tsx`
- UI Exports: `@/components/ui/ui.exports` (named barrel)
- Stores: `packages/webapp/src/stores/*.ts` (Zustand)
- API Client: `@/lib/api/api.exports`
- i18n Config: `@/i18n/i18n.config`
- i18n Locales: `packages/webapp/src/i18n/locales/*.json`
- Path Alias: `@/*` → `src/*`

## Bun

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## Code Style

This project uses Biome for formatting and linting. Read `biome.json` and follow its rules when writing code.
