# @gameofblocks/database

A PostgreSQL database package using Drizzle ORM for the Gameofblocks monorepo workspace.

## Overview

This package is part of the Gameofblocks monorepo and handles all database operations using Drizzle ORM with PostgreSQL.

## Monorepo Setup

This package is configured as an internal package within the Turborepo monorepo. Other workspace packages can depend on it by adding it to their `package.json`:

```json
{
  "dependencies": {
    "@gameofblocks/database": "*"
  }
}
```

## Installation

From the root of your monorepo:

```bash
pnpm install
```

If adding to a new workspace package:

```bash
pnpm add @gameofblocks/database --filter @gameofblocks/your-package
```

## Environment Configuration

1. Create a `.env` file in your monorepo root with the following variables:

```env
# PostgreSQL Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=mydatabase
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
DB_SSL=false

# Connection URL (constructed from above variables)
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mydatabase
```

2. Create a `drizzle.config.ts` in the database package:

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Adjust path based on your monorepo structure

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.POSTGRES_PORT),
    ssl: process.env.DB_SSL === 'true',
  },
} satisfies Config;
```

## Usage in Workspace Packages

```typescript
import { db } from '@gameofblocks/database';

// Example query
const users = await db.query.users.findMany();
```

## Available Scripts

Run these commands from the root of your monorepo:

```bash
# Generate migrations
pnpm --filter @gameofblocks/database db:generate

# Push migrations to database
pnpm --filter @gameofblocks/database db:push

# Launch Drizzle Studio
pnpm --filter @gameofblocks/database db:studio
```

Or add them to your root `package.json`:

```json
{
  "scripts": {
    "db:generate": "pnpm --filter @gameofblocks/database db:generate",
    "db:push": "pnpm --filter @gameofblocks/database db:push",
    "db:studio": "pnpm --filter @gameofblocks/database db:studio"
  }
}
```

## Working with Migrations

### Create a New Migration

1. Modify your schema in `packages/database/src/schema.ts`
2. Generate the migration:
```bash
pnpm db:generate
```

### Apply Migrations

Push migrations to your database:
```bash
pnpm db:push
```

### View and Manage Database

Launch Drizzle Studio:
```bash
pnpm db:studio
```

## Package Exports

```typescript
// Database client
import { db } from '@gameofblocks/database';

// Schema and types
import { coins } from '@gameofblocks/database';
```

## Project Structure

```
├── apps/
├── packages/
│   ├── database/
│   │   ├── src/
│   │   │   ├── index.ts     # Main entry point
│   │   │   └── schema.ts    # Database schema definitions
│   │   ├── drizzle/         # Migration files
│   │   └── package.json
├── turbo.json
└── package.json
```

## Local Development Setup

1. Ensure PostgreSQL is running locally
2. Create `.env` file with required variables
3. Create database if it doesn't exist:
```bash
createdb mydatabase
```
4. Apply migrations:
```bash
pnpm db:push
```

## Troubleshooting

Common issues:

- **Database Connection Issues**: 
  - Verify PostgreSQL is running on port 5432
  - Check credentials in `.env` match your local PostgreSQL setup
  - Ensure `DB_SSL=false` for local development
- **Migration Failures**: 
  - Ensure database exists (`mydatabase`)
  - Check PostgreSQL user has necessary permissions
- **Environment Variables**: 
  - Verify `.env` file is in monorepo root
  - All required variables are set
  - No trailing spaces in variable values