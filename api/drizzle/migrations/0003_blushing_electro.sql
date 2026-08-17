ALTER TABLE "business_profiles" ADD COLUMN "country_code" text DEFAULT '62' NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "country_code" text DEFAULT '62' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country_code" text DEFAULT '62' NOT NULL;