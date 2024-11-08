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
  1: "ATTACK",
  2: "ENERGY",
  3: "RECOVERY",
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
const PLAYER_CREATED_EVENT =
  "0x02716372be32fe9a63c2fc129c0616f42197afa389b71f7f51d7e242b16c1b46";
const PLAYER_UPDATED_EVENT =
  "0x031f8c8209f4535baa1913d00bb2a44064c722e037de321dd7e2e029a397ddda";
const PLAYER_EARNED_GOLD_EVENT =
  "0x00300845cd477625325aa95c11d42391d6a9396236bf5034797d00f718ff8f99";
// Filter configuration
const filter = {
  header: {
    weak: true,
  },
  events: [
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [PLAYER_CREATED_EVENT],
      includeReceipt: false,
    },
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [PLAYER_UPDATED_EVENT],
      includeReceipt: false,
    },
    {
      fromAddress: CONTRACT_ADDRESS,
      keys: [PLAYER_EARNED_GOLD_EVENT],
      includeReceipt: false,
    },
  ],
};

// Main configuration
export const config: Config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 293160,
  network: "starknet",
  authToken: "dna_szdjATEagn6GhxEyPPeL",
  finality: "DATA_STATUS_ACCEPTED",
  filter,
  sinkType: "postgres",
  sinkOptions: {
    entityMode: true,
    connectionString: DATABASE_URL,
    tableName: "players",
    noTls: true,
  },
};

function parsePlayerData(
  data: string[],
  eventKey: string
): Partial<TransformResult> {
  try {
    // Determine the offset based on event type
    const offset = eventKey === PLAYER_UPDATED_EVENT ? 1 : 0;

    // Parse upgrade_type for PLAYER_UPDATED_EVENT
    const result: Partial<TransformResult> = {};
    if (eventKey === PLAYER_UPDATED_EVENT) {
      result.upgrade_type = UPDATE_TYPE[parseInt(data[0])] as string;
    }

    // Parse the rest of the data with offset
    Object.assign(result, {
      attack_power: parseInt(data[0 + offset], 16),
      energy_cap: parseInt(data[1 + offset], 16),
      energy_recovery: parseInt(data[2 + offset], 16),
      attack_level: parseInt(data[3 + offset], 16),
      energy_level: parseInt(data[4 + offset], 16),
      recovery_level: parseInt(data[5 + offset], 16),
      current_boss_id: parseInt(data[6 + offset], 16),
      // Handle gold differently based on event type
      gold_earned: 0,
      total_gold:
        eventKey === PLAYER_CREATED_EVENT
          ? 0
          : Number(BigInt(data[7 + offset])),
      gold_spent:
        eventKey === PLAYER_CREATED_EVENT
          ? 0
          : Number(BigInt(data[8 + offset])),
    });

    return result;
  } catch (error) {
    logger.error("Error parsing player data:", error);
    throw new Error(`Failed to parse player data: ${error}`);
  }
}

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
    logger.debug("Processing data:", {
      eventKey,
    });
    try {
      if (eventKey === PLAYER_EARNED_GOLD_EVENT) {
        console.log("PLAYER_EARNED_GOLD_EVENT");
        return {
          entity: {
            contract_address,
          },
          update: {
            gold_earned: parseInt(event.data[0], 16),
            total_gold: parseInt(event.data[1], 16),
            contract_address,
            id: transactionHash,
            last_updated: timestamp,
            action_type: "PLAYER_ATTACK",
            gold_spent: 0,
            upgrade_type: null,
          },
        };
      }
      // Handle Player Created Event
      if (eventKey === PLAYER_CREATED_EVENT) {
        const playerData = parsePlayerData(event.data, eventKey);
        const baseData = {
          block_hash: blockHash,
          block_number: Number(blockNumber),
          block_timestamp: timestamp,
          transaction_hash: transactionHash,
          ...playerData,
          action_type: "PLAYER_CREATED",
        };
        logger.debug("Processing data PLAYER_UPDATED_EVENT:", baseData);

        return {
          insert: {
            ...baseData,
            contract_address,
            id: transactionHash,
            last_updated: timestamp,
          },
        };
      }
      // Handle Player Updated Event
      else if (eventKey === PLAYER_UPDATED_EVENT) {
        const playerData = parsePlayerData(event.data, eventKey);
        const baseData = {
          block_hash: blockHash,
          block_number: Number(blockNumber),
          block_timestamp: timestamp,
          transaction_hash: transactionHash,
          ...playerData,
          action_type: "PLAYER_UPDATED",
        };
        logger.debug("Processing data PLAYER_UPDATED_EVENT:", baseData);
        return {
          entity: {
            contract_address,
          },
          update: {
            ...baseData,
            contract_address,
            id: transactionHash,
            last_updated: timestamp,
          },
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
