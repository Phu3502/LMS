ALTER TABLE "salaries" ALTER COLUMN "total_reports" SET DATA TYPE integer USING total_reports::integer;--> statement-breakpoint
ALTER TABLE "salaries" ALTER COLUMN "amount" SET DATA TYPE integer USING amount::integer;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'teacher' NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;