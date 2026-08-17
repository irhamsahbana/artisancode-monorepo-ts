CREATE TABLE "webhook_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"headers" json NOT NULL,
	"body" text NOT NULL,
	"target_path" text NOT NULL,
	"is_valid" boolean DEFAULT false NOT NULL,
	"error_message" text,
	"invoice_number" text,
	"payment_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_protected" boolean DEFAULT false NOT NULL;