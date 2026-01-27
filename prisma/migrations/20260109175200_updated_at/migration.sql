-- AlterTable
ALTER TABLE "public"."organisations" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "public"."users" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "public"."user_on_org" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "public"."bookings" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
ALTER TABLE "public"."events" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;