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
