CREATE TABLE "birthday_greeting_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recipient_count" numeric NOT NULL,
	"recipient_logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "birthday_greeting_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"audience_gender" "gender",
	"audience_religion" text,
	"audience_segmentation_id" uuid,
	"audience_customer_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "broadcast_templates" ALTER COLUMN "occasion" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "broadcast_templates" ALTER COLUMN "occasion" SET DEFAULT 'custom'::text;--> statement-breakpoint
DROP TYPE "public"."broadcast_occasion";--> statement-breakpoint
CREATE TYPE "public"."broadcast_occasion" AS ENUM('idul_fitri', 'idul_adha', 'christmas', 'new_year', 'national_day', 'company_anniversary', 'thank_you', 'custom');--> statement-breakpoint
ALTER TABLE "broadcast_templates" ALTER COLUMN "occasion" SET DEFAULT 'custom'::"public"."broadcast_occasion";--> statement-breakpoint
ALTER TABLE "broadcast_templates" ALTER COLUMN "occasion" SET DATA TYPE "public"."broadcast_occasion" USING "occasion"::"public"."broadcast_occasion";--> statement-breakpoint
ALTER TABLE "birthday_greeting_settings" ADD CONSTRAINT "birthday_greeting_settings_audience_segmentation_id_categories_id_fk" FOREIGN KEY ("audience_segmentation_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;