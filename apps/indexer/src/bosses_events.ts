import { getLogger, setup } from "https://deno.land/std@0.206.0/log/mod.ts";
import { ConsoleHandler } from "https://deno.land/std@0.206.0/log/handlers.ts";

// Type definitions
interface Config {
  streamUrl: string;
  startingBlock: number;
  network: string;
  authToken: string;
  finality: string;
  filter: {
    header: {
      weak: boolean;
    };
    events: Array<{
      fromAddress: string;
      keys: string[];
      includeReceipt: boolean;
    }>;
  };
  sinkType: string;
  sinkOptions: {
    connectionString: string;
    tableName: string;
    // invalidate: Array<{ column: string; value: string }>;
    noTls?: boolean;
  };
}

interface Header {
  blockNumber: string;
  blockHash: string;
}

interface Event {
  event: {
    keys: string[];
    data: string[];
  };
  transaction: {
    meta: {
      hash: string;
    };
    invokeV1: {
      senderAddress: string;
    };
  };
}

// Logger setup
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

const logger = getLogger();

// Environment variables
const DATABASE_URL = Deno.env.get("DATABASE_URL");
const CONTRACT_ADDRESS = Deno.env.get("GOB_CONTRACT");
if (!DATABASE_URL || !CONTRACT_ADDRESS) {
  logger.error("Missing required environment variables");
  Deno.exit(1);
}

function removeLeadingZeros(paddedHex: string): string {
  return "0x" + paddedHex.replace("0x", "").replace(/^0+/, "");
}

// Event keys
const BOSS_CREATED =
  "0x029c36ed7d680ffd775bc156098edb6eb95d743a3811c99cb217286e14e5098a";
// Filter configuration
const filter = {
  header: {
    weak: true,
  },
  events: [
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [BOSS_CREATED],
      includeReceipt: false,
    },
  ],
};

// Main configuration
export const config: Config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 296040,
  network: "starknet",
  authToken: "dna_BInUSPnNjV8cuFmE4tPw",
  finality: "DATA_STATUS_ACCEPTED",
  filter,
  sinkType: "postgres",
  sinkOptions: {
    connectionString: DATABASE_URL,
    tableName: "bosses",
    noTls: true,
  },
};

export default function transform({
  events,
}: {
  header: Header;
  events: Event[];
}) {
  return events.flatMap(({ event }) => {
    const eventKey = event.keys[0];
    const BossId = event.keys[1];
    logger.debug("Processing data:", {
      eventKey,
    });
    try {
      if (eventKey === BOSS_CREATED) {
        return {
          id: parseInt(BossId),
          is_active: true,
          base_health: parseInt(event.data[0]),
          last_updated: new Date().toISOString(),
        };
      } else {
        logger.error(`Unknown event type: ${eventKey}`);
        return [];
      }
    } catch (error) {
      logger.error("Transform error:", error);
      throw error;
    }
  });
}
