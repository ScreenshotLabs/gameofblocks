CREATE TABLE IF NOT EXISTS "payments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"telegram_user_id" varchar NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar NOT NULL,
	"telegram_payment_charge_id" varchar NOT NULL,
	"provider_payment_charge_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
