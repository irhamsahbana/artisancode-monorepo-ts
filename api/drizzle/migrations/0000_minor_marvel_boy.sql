CREATE TYPE "public"."broadcast_log_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."broadcast_occasion" AS ENUM('idul_fitri', 'idul_adha', 'christmas', 'new_year', 'national_day', 'company_anniversary', 'thank_you', 'custom');--> statement-breakpoint
CREATE TYPE "public"."broadcast_status" AS ENUM('draft', 'scheduled', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."customer_potential" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('prospect', 'active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'business');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('prospect', 'in_progress', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."quotation_status" AS ENUM('new', 'in_review', 'responded');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."uom_category" AS ENUM('length', 'area', 'volume', 'mass', 'time', 'quantity', 'other');--> statement-breakpoint
CREATE TABLE "broadcast_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recipient_count" numeric NOT NULL,
	"status" "broadcast_log_status" DEFAULT 'pending' NOT NULL,
	"recipient_logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "broadcast_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"message" text NOT NULL,
	"occasion" "broadcast_occasion" DEFAULT 'custom' NOT NULL,
	"audience_gender" "gender",
	"audience_religion" text,
	"audience_segmentation_id" uuid,
	"audience_customer_status" text,
	"scheduled_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"status" "broadcast_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"business_type" text,
	"phone" text,
	"email" text,
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"group" text DEFAULT '' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
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
CREATE TABLE "customer_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"contact_id" uuid,
	"rating_date" text NOT NULL,
	"payment_score" numeric NOT NULL,
	"relationship_score" numeric NOT NULL,
	"problem_notes" text,
	"risk_level" "risk_level" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "customer_type" NOT NULL,
	"category_id" uuid,
	"segmentation_id" uuid,
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
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"unit" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"visit_date" text NOT NULL,
	"met_with" text,
	"topic" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_number" text NOT NULL,
	"customer_id" uuid NOT NULL,
	"contact_id" uuid,
	"name" text NOT NULL,
	"location" text,
	"latitude" numeric,
	"longitude" numeric,
	"source_of_funds" text,
	"pic_name" text,
	"status" "project_status" DEFAULT 'prospect' NOT NULL,
	"estimated_value" numeric,
	"spk_number" text,
	"lost_reason" text,
	"winner_competitor" text,
	"products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "projects_project_number_unique" UNIQUE("project_number")
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text,
	"project_id" uuid,
	"topic" text,
	"requester_name" text NOT NULL,
	"company_name" text,
	"whatsapp" text NOT NULL,
	"email" text,
	"products" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"status" "quotation_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "unit_conversions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_unit_id" uuid NOT NULL,
	"to_unit_id" uuid NOT NULL,
	"factor" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unit_conversions_from_to_unique" UNIQUE("from_unit_id","to_unit_id")
);
--> statement-breakpoint
CREATE TABLE "uoms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"symbol" text DEFAULT '' NOT NULL,
	"category" "uom_category" DEFAULT 'other' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uoms_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "broadcast_logs" ADD CONSTRAINT "broadcast_logs_template_id_broadcast_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."broadcast_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "broadcast_templates" ADD CONSTRAINT "broadcast_templates_audience_segmentation_id_categories_id_fk" FOREIGN KEY ("audience_segmentation_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_ratings" ADD CONSTRAINT "customer_ratings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_ratings" ADD CONSTRAINT "customer_ratings_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_segmentation_id_categories_id_fk" FOREIGN KEY ("segmentation_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_area_id_categories_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_visits" ADD CONSTRAINT "project_visits_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_conversions" ADD CONSTRAINT "unit_conversions_from_unit_id_uoms_id_fk" FOREIGN KEY ("from_unit_id") REFERENCES "public"."uoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_conversions" ADD CONSTRAINT "unit_conversions_to_unit_id_uoms_id_fk" FOREIGN KEY ("to_unit_id") REFERENCES "public"."uoms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "broadcast_logs_template_id_idx" ON "broadcast_logs" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "broadcast_templates_status_idx" ON "broadcast_templates" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_group_idx" ON "categories" USING btree ("group");--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "contacts_customer_id_deleted_at_idx" ON "contacts" USING btree ("customer_id","deleted_at");--> statement-breakpoint
CREATE INDEX "customer_ratings_customer_id_idx" ON "customer_ratings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "customer_ratings_contact_id_idx" ON "customer_ratings" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "customers_deleted_at_idx" ON "customers" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "permissions_deleted_at_idx" ON "permissions" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "products_status_deleted_at_idx" ON "products" USING btree ("status","deleted_at");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX "project_visits_project_id_idx" ON "project_visits" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_customer_id_deleted_at_idx" ON "projects" USING btree ("customer_id","deleted_at");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quotations_status_idx" ON "quotations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "roles_deleted_at_idx" ON "roles" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "uoms_category_idx" ON "uoms" USING btree ("category");