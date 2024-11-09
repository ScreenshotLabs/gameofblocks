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
const BOSS_ATTACKED =
  "0x02b61b9b7ef5b3fe9930e4e077f664bc7d041d560e816e57c0bf35b2e07c16c0";
// const BOSS_DEFEATED =
//   "x2b61b9b7ef5b3fe9930e4e077f664bc7d041d560e816e57c0bf35b2e07c16c0";
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
    // {
    //   fromAddress: CONTRACT_ADDRESS,
    //   keys: [BOSS_DEFEATED],
    //   includeReceipt: false,
    // },
  ],
};

// Main configuration
export const config: Config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 293160,
  network: "starknet",
  authToken: "dna_LLzGr1wBZ0kcnyyRutt5",
  finality: "DATA_STATUS_PENDING",
  filter,
  sinkType: "postgres",
  sinkOptions: {
    entityMode: true,
    connectionString: DATABASE_URL,
    tableName: "player_bosses",
    noTls: true,
  },
};

export default function transform({
  header,
  events,
}: {
  header: Header;
  events: Event[];
}) {
  const { blockNumber, blockHash } = header;

  return events.flatMap(({ event, transaction }, index) => {
    const eventKey = event.keys[0];
    const transactionHash = transaction.meta.hash;
    try {
      // Handle Player Created Event
      if (eventKey === BOSS_ATTACKED) {
        return {
          insert: {
            id: `${transactionHash}_${index}`,
            player_id: event.keys[1],
            boss_id: parseInt(event.data[0]),
            current_health: parseInt(event.data[2]),
            is_defeated: false,
            last_updated: new Date().toISOString(),
          },
        };
      }
      // Handle Player Updated Event
      // else if (eventKey === BOSS_DEFEATED) {
      //   return {
      //     entity: {
      //       contract_address,
      //     },
      //     update: {
      //       contract_address,
      //       id: transactionHash,
      //       last_updated: timestamp,
      //     },
      //   };
      // }
      else {
        logger.error(`Unknown event type: ${eventKey}`);
        return [];
      }
    } catch (error) {
      logger.error("Transform error:", error);
      throw error;
    }
  });
}
