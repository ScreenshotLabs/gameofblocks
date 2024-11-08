import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  
  dbCredentials: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB || 'postgres',
    ssl: process.env.DB_SSL === 'true'
  },

  migrations: {
    table: "__drizzle_migrations",
    schema: "public"
  },

  strict: true,
  verbose: true,
  breakpoints: true,
});