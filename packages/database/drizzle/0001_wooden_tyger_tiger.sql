CREATE TABLE IF NOT EXISTS "payments" (
	"id" integer PRIMARY KEY NOT NULL,
	"player_id" varchar NOT NULL,
	"invoice_id" varchar NOT NULL,
	"amount" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "isPremium" boolean;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
