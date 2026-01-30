ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."reservation_status";--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'collected', 'cancelled', 'completed', 'confirmed');--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."reservation_status";--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE "public"."reservation_status" USING "status"::"public"."reservation_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shops" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "shop_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "pickup_date";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "return_date";--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_slug_unique" UNIQUE("slug");