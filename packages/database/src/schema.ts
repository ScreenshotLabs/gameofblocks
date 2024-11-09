import {
  pgTable,
  varchar,
  timestamp,
  bigint,
  integer,
  boolean,
  primaryKey,
  customType,
  uuid,
} from "drizzle-orm/pg-core";

const int8range = customType<{ data: string; driverData: string }>({
  dataType() {
    return "int8range";
  },
});

export const bosses = pgTable("bosses", {
  id: varchar("id").primaryKey(),
  baseHealth: integer("base_health").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: bigint("_cursor", { mode: "number" }).notNull(),
});

export const players = pgTable("players", {
  id: varchar("id").primaryKey(),
  contractAddress: varchar("contract_address"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: int8range("_cursor").notNull(),
  attackPower: integer("attack_power").notNull(),
  energyCap: integer("energy_cap").notNull(),
  energyRecovery: integer("energy_recovery").notNull(),
  currentBossId: integer("current_boss_id").notNull(),
  goldEarned: bigint("gold_earned", { mode: "number" }),
  goldspent: bigint("gold_spent", { mode: "number" }),
  totalGold: bigint("total_gold", { mode: "number" }).notNull(),
  attackLevel: integer("attack_level").notNull(),
  energyLevel: integer("energy_level").notNull(),
  recoveryLevel: integer("recovery_level").notNull(),
  upgrade_type: varchar("upgrade_type"),
  action_type: varchar("action_type"),
  isPremium: boolean("isPremium"),
});

export const playerBosses = pgTable("player_bosses", {
  id: varchar("id").primaryKey(),
  playerId: varchar("player_id").notNull(),
  bossId: varchar("boss_id").notNull(),
  currentHealth: integer("current_health").notNull(),
  isDefeated: boolean("is_defeated").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  _cursor: int8range("_cursor").notNull(),
});

export const payments = pgTable("payments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  telegramUserId: varchar("telegram_user_id").notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency").notNull(),
  telegramPaymentChargeId: varchar("telegram_payment_charge_id").notNull(),
  providerPaymentChargeId: varchar("provider_payment_charge_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});
