import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,            // proxy for runtime
    shadowDatabaseUrl: process.env.DIRECT_URL!, // local DB for migrations
  },
});
