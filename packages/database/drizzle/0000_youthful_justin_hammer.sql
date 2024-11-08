CREATE TABLE IF NOT EXISTS "bosses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_health" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"_cursor" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_bosses" (
	"player_id" varchar NOT NULL,
	"boss_id" uuid NOT NULL,
	"current_health" integer NOT NULL,
	"is_defeated" boolean NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"_cursor" bigint NOT NULL,
	CONSTRAINT "player_bosses_player_id_boss_id_pk" PRIMARY KEY("player_id","boss_id")
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
	"action_type" varchar,
	CONSTRAINT "players_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_bosses" ADD CONSTRAINT "player_bosses_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_bosses" ADD CONSTRAINT "player_bosses_boss_id_bosses_id_fk" FOREIGN KEY ("boss_id") REFERENCES "public"."bosses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
