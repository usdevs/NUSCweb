/*
  Warnings:

  - You are about to drop the column `slug` on the `organisations` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."organisations_slug_key";

-- AlterTable
ALTER TABLE "public"."organisations" DROP COLUMN "slug";
