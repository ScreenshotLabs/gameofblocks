# @gameofblocks/indexer

Starknet event indexers for the Gameofblocks protocol, built with Apibara. These indexers track memecoin creation and liquidity events.

## Overview

This package contains two indexers:
1. **Player Stats Indexer**: Tracks player stats

## Prerequisites

- [Deno](https://deno.land/) installed
- [Apibara CLI](https://www.apibara.com/) installed
- PostgreSQL database setup via `@gameofblocks/database`

## Installation

From the root of your monorepo:

```bash
pnpm install
```

## Database Setup

This package depends on `@gameofblocks/database` for its schema and migrations. Ensure you've run the database migrations:

```bash
# From monorepo root
pnpm db:push
```

## Environment Variables

Create a `.env` file in your monorepo root:

```env
# Database Configuration (from @gameofblocks/database)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=mydatabase
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
DB_SSL=false
DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/mydatabase

# Contract Configuration
GAMEOFBLOCKS_CONTRACT=your_contract_address
```

## Running the Indexers

### Memecoin Creation Indexer

```bash
apibara run \
  --allow-env \
  src/create_memecoin.ts \
  --sink-id create_memecoin
```

### Liquidity Events Indexer

```bash
apibara run \
  --allow-env \
  src/liquidity_events.ts \
  --sink-id liquidity_events
```

## Indexer Details

### Memecoin Creation Indexer

Tracks the following event:
```solidity
0x1be539d3a1327d450ab9b7a754f7708ea94f67182f2506217cafff2d694f8e1
```

### Liquidity Events Indexer

Tracks two events:
```solidity
// Add Liquidity
0x02df440cd1868de1af168a3a57b8cdd850f9a25f269686c61b94d8697d439b32

// Remove Liquidity
0x9d514f6fa3e1401a5adcf67737a9dbbd7443740de12c62db020a65a19eb0ad
```

## Configuration

Both indexers are configured with:
- Network: Starknet Sepolia
- Stream URL: https://sepolia.starknet.a5a.ch
- Starting Block: 170896
- Finality: DATA_STATUS_ACCEPTED

## Development

### Project Structure
```
src/
├── create_memecoin.ts    # Memecoin creation indexer
├── liquidity_events.ts   # Liquidity events indexer
└── utils/               
    └── uint256.ts        # BigInt conversion utilities
```

### Adding New Events

1. Add the event key to the respective indexer's configuration
2. Update the transform function to handle the new event data
3. Ensure corresponding database migrations are created in `@gameofblocks/database`
4. Update type definitions

### Debugging

Both indexers include comprehensive logging. Set the log level in the setup:

```typescript
await setup({
  handlers: {
    console: new ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});
```

## Troubleshooting

Common issues:

- **Environment Variables Missing**: Ensure `.env` file exists in monorepo root
- **Database Connection**: Verify database is running and migrations are up to date
- **Permission Issues**: Verify Deno has necessary permissions with `--allow-env`
- **Event Processing**: Confirm contract address and event keys are correct