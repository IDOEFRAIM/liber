ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."reservation_status";--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'collected', 'completed', 'cancelled', 'returned');--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."reservation_status";--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE "public"."reservation_status" USING "status"::"public"."reservation_status";