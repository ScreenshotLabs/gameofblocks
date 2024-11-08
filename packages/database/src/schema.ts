import { pgTable, varchar, timestamp, bigint, integer, boolean, primaryKey, customType, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const int8range = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'int8range';
  },
});

// First, we'll keep bosses with UUID to maintain compatibility
export const bosses = pgTable("bosses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  baseHealth: integer("base_health").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: bigint("_cursor", { mode: "number" }).notNull(),
});

// Players can use varchar since it's new
export const players = pgTable("players", {
  id: varchar("id").primaryKey().unique(),
  contractAddress: varchar("contract_address"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: int8range("_cursor").notNull(),
  
  // Player stats
  attackPower: integer("attack_power").notNull(),
  energyCap: integer("energy_cap").notNull(),
  energyRecovery: integer("energy_recovery").notNull(),
  currentBossId: integer("current_boss_id").notNull(),
  
  // Player economy
  goldEarned: bigint("gold_earned", { mode: "number" }),
  goldspent: bigint("gold_spent", { mode: "number" }),
  totalGold: bigint("total_gold", { mode: "number" }).notNull(),
  attackLevel: integer("attack_level").notNull(),
  energyLevel: integer("energy_level").notNull(),
  recoveryLevel: integer("recovery_level").notNull(),
  upgrade_type: varchar("upgrade_type"),
  action_type: varchar("action_type"),
});

// Keep the relationship table consistent with the parent tables
export const playerBosses = pgTable("player_bosses", {
  playerId: varchar("player_id").notNull().references(() => players.id),
  bossId: uuid("boss_id").notNull().references(() => bosses.id),
  currentHealth: integer("current_health").notNull(),
  isDefeated: boolean("is_defeated").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: bigint("_cursor", { mode: "number" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.playerId, table.bossId] })
}));

// Relations configuration
export const playersRelations = relations(players, ({ many }) => ({
  playerBosses: many(playerBosses)
}));

export const bossesRelations = relations(bosses, ({ many }) => ({
  playerBosses: many(playerBosses)
}));

export const playerBossesRelations = relations(playerBosses, ({ one }) => ({
  player: one(players, {
    fields: [playerBosses.playerId],
    references: [players.id],
  }),
  boss: one(bosses, {
    fields: [playerBosses.bossId],
    references: [bosses.id],
  }),
}));