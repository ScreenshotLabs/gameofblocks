CREATE TABLE IF NOT EXISTS "bosses" (
	"id" varchar PRIMARY KEY NOT NULL,
	"base_health" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"_cursor" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_bosses" (
	"id" varchar PRIMARY KEY NOT NULL,
	"player_id" varchar NOT NULL,
	"boss_id" varchar NOT NULL,
	"current_health" integer NOT NULL,
	"is_defeated" boolean NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"_cursor" "int8range" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "players" (
	"id" varchar PRIMARY KEY NOT NULL,
	"contract_address" varchar,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"_cursor" "int8range" NOT NULL,
	"attack_power" integer NOT NULL,
	"energy_cap" integer NOT NULL,
	"energy_recovery" integer NOT NULL,
	"current_boss_id" integer NOT NULL,
	"gold_earned" bigint,
	"gold_spent" bigint,
	"total_gold" bigint NOT NULL,
	"attack_level" integer NOT NULL,
	"energy_level" integer NOT NULL,
	"recovery_level" integer NOT NULL,
	"upgrade_type" varchar,
	"action_type" varchar
);
