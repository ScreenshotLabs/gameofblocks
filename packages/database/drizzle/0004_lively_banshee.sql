ALTER TABLE "payments" RENAME COLUMN "invoice_id" TO "checkout_id";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_invoice_id_unique";--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_checkout_id_unique" UNIQUE("checkout_id");