# api

Hono API deployed to Cloudflare Workers.

> See [root README](../../README.md) for development and deployment commands.

## Generate Cloudflare Types

```bash
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```
