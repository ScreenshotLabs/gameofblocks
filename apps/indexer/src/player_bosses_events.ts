import { getLogger, setup } from "https://deno.land/std@0.206.0/log/mod.ts";
import { ConsoleHandler } from "https://deno.land/std@0.206.0/log/handlers.ts";
import { shortString } from "https://esm.sh/starknet@6.11.0";

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
    entityMode: boolean;
    connectionString: string;
    tableName: string;
  };
}

interface Header {
  blockNumber: string;
  blockHash: string;
  timestamp: string;
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

const UPDATE_TYPE: { [key: number]: string } = {
  1: 'ATTACK',
  2: 'ENERGY',
  3: 'RECOVERY'
} as const;

interface TransformResult {
  block_hash: string;
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
  contract_address: string;
  last_updated: string;
  _cursor: number;
  attack_power: number;
  energy_cap: number;
  energy_recovery: number;
  current_boss_id: number;
  gold: number;
  attack_level: number;
  energy_level: number;
  recovery_level: number;
  upgrade_type?: string;
  gold_spent?: number;
}

function removeLeadingZeros(paddedHex: string): string {
  return "0x" + paddedHex.replace("0x", "").replace(/^0+/, "");
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

// Event keys
const BOSS_ATTACKED = "0x02716372be32fe9a63c2fc129c0616f42197afa389b71f7f51d7e242b16c1b46";
const BOSS_DEFEATED = "0x031f8c8209f4535baa1913d00bb2a44064c722e037de321dd7e2e029a397ddda";
// Filter configuration
const filter = {
  header: {
    weak: true,
  },
  events: [
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [BOSS_ATTACKED],
      includeReceipt: false,
    },
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [BOSS_DEFEATED],
      includeReceipt: false,
    },
  ],
};

// Main configuration
export const config: Config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 293160,
  network: "starknet",
  authToken: "dna_LLzGr1wBZ0kcnyyRutt5",
  finality: "DATA_STATUS_ACCEPTED",
  filter,
  sinkType: "postgres",
  sinkOptions: {
    entityMode: true,
    connectionString: DATABASE_URL,
    tableName: "player_bosses",
  },
};

export default function transform({
  header,
  events,
}: {
  header: Header;
  events: Event[];
}) {
  const { blockNumber, blockHash, timestamp } = header;

  return events.flatMap(({ event, transaction }) => {
    const eventKey = event.keys[0];
    const transactionHash = transaction.meta.hash;
    const contract_address = event.keys[1];
    logger.debug('Processing data:', {
      eventKey
    });
    try {
      // Handle Player Created Event
      if (eventKey === BOSS_ATTACKED) {
        return {
          insert: {
            id: transactionHash,
            player_id: event.keys[1],
            boss_id: event.data[1],
            current_health: event.data[2],
            is_defeated: false,
            last_updated: timestamp,
          }
        };
      }
      // Handle Player Updated Event
      else if (eventKey === BOSS_DEFEATED) {
        return {
          entity: {
            contract_address
          },
          update: {
            contract_address,
            id: transactionHash,
            last_updated: timestamp,
          }
        };
      }

      else {
        logger.error(`Unknown event type: ${eventKey}`);
        return [];
      }

    } catch (error) {
      logger.error('Transform error:', error);
      throw error;
    }
  });
}