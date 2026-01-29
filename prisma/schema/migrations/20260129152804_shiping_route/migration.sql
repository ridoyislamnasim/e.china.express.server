/*
  Warnings:

  - You are about to drop the column `shipScheduleId` on the `FreightRate` table. All the data in the column will be lost.
  - You are about to drop the column `shipId` on the `ShipRoute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FreightRate" DROP CONSTRAINT "FreightRate_shipScheduleId_fkey";

-- AlterTable
ALTER TABLE "FreightRate" DROP COLUMN "shipScheduleId";

-- AlterTable
ALTER TABLE "ShipRoute" DROP COLUMN "shipId";
