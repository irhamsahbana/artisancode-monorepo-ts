ALTER TABLE "broadcast_templates" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "unit_conversions" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "uoms" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "broadcast_templates_deleted_at_idx" ON "broadcast_templates" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "unit_conversions_deleted_at_idx" ON "unit_conversions" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "uoms_deleted_at_idx" ON "uoms" USING btree ("deleted_at");