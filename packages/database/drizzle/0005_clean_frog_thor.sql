ALTER TABLE "payments" DROP CONSTRAINT "payments_checkout_id_unique";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_player_id_players_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "telegram_user_id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "player_id";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "checkout_id";