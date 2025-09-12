-- CreateEnum
CREATE TYPE "public"."IGCategory" AS ENUM ('Sports', 'SocioCultural', 'Welfare', 'Guips', 'Others');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "telegram_user_name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organisations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'An NUSC organisation',
    "is_admin_org" BOOLEAN NOT NULL DEFAULT false,
    "invite_token" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "public"."IGCategory" NOT NULL,
    "is_inactive" BOOLEAN NOT NULL DEFAULT false,
    "is_invisible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_on_org" (
    "user_id" INTEGER NOT NULL,
    "org_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_on_org_pkey" PRIMARY KEY ("user_id","org_id")
);

-- CreateTable
CREATE TABLE "public"."venues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" SERIAL NOT NULL,
    "booking_name" TEXT NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_org_id" INTEGER NOT NULL,
    "booked_for_org_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_org_id" INTEGER NOT NULL,
    "booked_for_org_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "booking_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "public"."users"("telegram_id");

-- CreateIndex
CREATE UNIQUE INDEX "organisations_slug_key" ON "public"."organisations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "events_booking_id_key" ON "public"."events"("booking_id");

-- AddForeignKey
ALTER TABLE "public"."user_on_org" ADD CONSTRAINT "user_on_org_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_on_org" ADD CONSTRAINT "user_on_org_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_user_id_user_org_id_fkey" FOREIGN KEY ("user_id", "user_org_id") REFERENCES "public"."user_on_org"("user_id", "org_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "bookings_booked_for_org_id_fkey" FOREIGN KEY ("booked_for_org_id") REFERENCES "public"."organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_user_id_user_org_id_fkey" FOREIGN KEY ("user_id", "user_org_id") REFERENCES "public"."user_on_org"("user_id", "org_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_booked_for_org_id_fkey" FOREIGN KEY ("booked_for_org_id") REFERENCES "public"."organisations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
