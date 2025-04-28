import config from '@/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema/',
  out: './src/drizzle',
  casing: 'snake_case',
  dialect: 'mysql',
  dbCredentials: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
  },
});
