CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'quarterly', 'annually', 'one_time');--> statement-breakpoint
CREATE TYPE "public"."billing_interval" AS ENUM('day', 'week', 'month', 'year');--> statement-breakpoint
CREATE TYPE "public"."billing_type" AS ENUM('one_time', 'recurring');--> statement-breakpoint
CREATE TYPE "public"."customer_potential" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('prospect', 'active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'business');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive', 'on_leave', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."file_status" AS ENUM('pending', 'attached', 'deleted', 'failed');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'unpaid', 'paid', 'overdue', 'pending', 'expired', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('pay_now', 'pay_later');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('daily', 'weekly', 'monthly', 'yearly', 'custom');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive', 'archived');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."student_status" AS ENUM('active', 'inactive', 'graduated', 'suspended', 'dropped', 'pending', 'on_leave');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"user_id" uuid NOT NULL,
	"entity_name" text DEFAULT '' NOT NULL,
	"entity_id" text DEFAULT '' NOT NULL,
	"activity" text DEFAULT '' NOT NULL,
	"before" json,
	"after" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"city" text DEFAULT '' NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"head_coach" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"parent_id" uuid,
	"group" text DEFAULT '' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"business_type" text,
	"phone" text,
	"email" text,
	"address" text,
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
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
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
CREATE TABLE "enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"product_pricing_id" uuid NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"billing_cycle" "billing_cycle" DEFAULT 'monthly' NOT NULL,
	"next_billing_date" timestamp with time zone,
	"auto_renew" boolean DEFAULT true NOT NULL,
	"status" "enrollment_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"invoice_number" text NOT NULL,
	"invoice_date" timestamp with time zone NOT NULL,
	"issued_date" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"status" "invoice_status" NOT NULL,
	"doku_invoice_id" text,
	"doku_request_id" text,
	"payment_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"invoice_id" uuid NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"method" text NOT NULL,
	"payment_date" timestamp with time zone NOT NULL,
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
CREATE TABLE "product_prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_pricing_id" uuid NOT NULL,
	"price" numeric DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'IDR' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_pricings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "product_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"day" text DEFAULT '' NOT NULL,
	"start_time" text DEFAULT '' NOT NULL,
	"end_time" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"name" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"capacity" integer DEFAULT 0,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
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
	"company_id" uuid,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "roles_company_id_name_unique" UNIQUE("company_id","name")
);
--> statement-breakpoint
CREATE TABLE "storage_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"folder" text DEFAULT '' NOT NULL,
	"object_key" text NOT NULL,
	"original_filename" text NOT NULL,
	"content_type" text,
	"is_public" boolean DEFAULT false NOT NULL,
	"status" "file_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"gender" text DEFAULT '' NOT NULL,
	"date_of_birth" timestamp with time zone NOT NULL,
	"birth_place" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"photo_url" text DEFAULT '' NOT NULL,
	"parent_name" text DEFAULT '' NOT NULL,
	"parent_phone" text DEFAULT '' NOT NULL,
	"parent_email" text DEFAULT '' NOT NULL,
	"emergency_contact_phone" text DEFAULT '' NOT NULL,
	"blood_type" text DEFAULT '' NOT NULL,
	"medical_notes" text DEFAULT '' NOT NULL,
	"status" "student_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "teacher_products" (
	"teacher_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "teacher_products_teacher_id_product_id_pk" PRIMARY KEY("teacher_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"specialty" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"birth_date" text DEFAULT '' NOT NULL,
	"biography" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
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
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_segmentation_id_categories_id_fk" FOREIGN KEY ("segmentation_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_area_id_categories_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_prices" ADD CONSTRAINT "product_prices_product_pricing_id_product_pricings_id_fk" FOREIGN KEY ("product_pricing_id") REFERENCES "public"."product_pricings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_pricings" ADD CONSTRAINT "product_pricings_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_schedules" ADD CONSTRAINT "product_schedules_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_products" ADD CONSTRAINT "teacher_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_logs_company_id_deleted_at_idx" ON "activity_logs" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "branches_company_id_deleted_at_idx" ON "branches" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "branches_status_idx" ON "branches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "categories_company_id_deleted_at_idx" ON "categories" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "categories_status_idx" ON "categories" USING btree ("status");--> statement-breakpoint
CREATE INDEX "companies_status_idx" ON "companies" USING btree ("status");--> statement-breakpoint
CREATE INDEX "companies_deleted_at_idx" ON "companies" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "contacts_customer_id_deleted_at_idx" ON "contacts" USING btree ("customer_id","deleted_at");--> statement-breakpoint
CREATE INDEX "customers_company_id_deleted_at_idx" ON "customers" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "enrollments_company_id_deleted_at_idx" ON "enrollments" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "invoices_company_id_deleted_at_idx" ON "invoices" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "invoices_enrollment_id_idx" ON "invoices" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE INDEX "invoices_invoice_date_idx" ON "invoices" USING btree ("invoice_date");--> statement-breakpoint
CREATE INDEX "payments_company_id_deleted_at_idx" ON "payments" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "payments_invoice_id_idx" ON "payments" USING btree ("invoice_id");--> statement-breakpoint
CREATE INDEX "permissions_deleted_at_idx" ON "permissions" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "product_prices_pricing_id_started_at_ended_at_idx" ON "product_prices" USING btree ("product_pricing_id","started_at","ended_at");--> statement-breakpoint
CREATE INDEX "product_pricings_product_id_name_deleted_at_idx" ON "product_pricings" USING btree ("product_id","name","deleted_at");--> statement-breakpoint
CREATE INDEX "products_company_id_deleted_at_idx" ON "products" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "roles_company_id_deleted_at_idx" ON "roles" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "idx_storage_files_company_status" ON "storage_files" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_storage_files_object_key" ON "storage_files" USING btree ("object_key");--> statement-breakpoint
CREATE INDEX "students_company_id_deleted_at_idx" ON "students" USING btree ("company_id","deleted_at");--> statement-breakpoint
CREATE INDEX "students_status_idx" ON "students" USING btree ("status");--> statement-breakpoint
CREATE INDEX "teachers_company_id_deleted_at_idx" ON "teachers" USING btree ("company_id","deleted_at");