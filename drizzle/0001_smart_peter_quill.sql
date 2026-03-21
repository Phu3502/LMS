DROP INDEX "classes_teacher_idx";--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "weekday" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "time" text NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "start_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "classes" ADD COLUMN "end_date" timestamp NOT NULL;