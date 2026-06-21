CREATE TYPE "public"."customer_potential" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('prospect', 'active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."customer_type" AS ENUM('individual', 'business');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "public"."master_item_type" AS ENUM('customer_category', 'segmentation', 'area', 'relation_status');--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "business_type" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "address" text;