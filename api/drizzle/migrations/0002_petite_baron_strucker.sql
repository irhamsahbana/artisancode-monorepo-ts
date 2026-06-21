CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"name" text NOT NULL,
	"position" text,
	"whatsapp" text,
	"email" text,
	"notes" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" "customer_type" NOT NULL,
	"category_id" uuid,
	"area_id" uuid,
	"status" "customer_status" DEFAULT 'prospect' NOT NULL,
	"potential" "customer_potential" DEFAULT 'medium' NOT NULL,
	"has_contract_history" boolean DEFAULT false NOT NULL,
	"last_revenue" numeric,
	"last_contract_year" integer,
	"primary_contact_id" uuid,
	"gender" "gender",
	"address" text,
	"birth_place" text,
	"date_of_birth" text,
	"religion" text,
	"education" text,
	"email" text,
	"spouse_name" text,
	"spouse_occupation" text,
	"children_names" text,
	"children_occupation" text,
	"character" text,
	"hobby" text,
	"company_name" text,
	"position" text,
	"company_address" text,
	"whatsapp" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "master_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"type" "master_item_type" NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_category_id_master_items_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."master_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_area_id_master_items_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."master_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "master_items" ADD CONSTRAINT "master_items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contacts_customer_id_deleted_at_idx" ON "contacts" USING btree ("customer_id","deleted_at");--> statement-breakpoint
CREATE INDEX "customers_company_id_deleted_at_idx" ON "customers" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "master_items_company_id_type_deleted_at_idx" ON "master_items" USING btree ("company_id","type","deleted_at");