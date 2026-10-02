CREATE TABLE "whatsapp_login_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"user_id" uuid,
	"confirm_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"consumed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "whatsapp_login_requests_confirm_token_unique" UNIQUE("confirm_token")
);
--> statement-breakpoint
ALTER TABLE "business_profiles" ADD COLUMN "whatsapp_device_id" text;--> statement-breakpoint
ALTER TABLE "whatsapp_login_requests" ADD CONSTRAINT "whatsapp_login_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "whatsapp_login_requests_phone_idx" ON "whatsapp_login_requests" USING btree ("phone");