import { defineConfig } from 'drizzle-kit';

const { LOCAL_DB_PATH, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN } = process.env;

// Local: LOCAL_DB_PATH=.wrangler/state/v3/d1/miniflare-D1DatabaseObject/... bun run db:studio
// Remote: CLOUDFLARE_* 환경변수 설정 필요
export default LOCAL_DB_PATH
  ? defineConfig({
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'sqlite',
      dbCredentials: {
        url: LOCAL_DB_PATH,
      },
    })
  : defineConfig({
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'sqlite',
      driver: 'd1-http',
      dbCredentials: {
        accountId: CLOUDFLARE_ACCOUNT_ID!,
        databaseId: CLOUDFLARE_DATABASE_ID!,
        token: CLOUDFLARE_D1_TOKEN!,
      },
    });
