/*
  Warnings:

  - You are about to drop the column `zondeCode` on the `CountryZone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CountryZone" DROP COLUMN "zondeCode",
ADD COLUMN     "zoneCode" TEXT;
