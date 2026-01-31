/*
  Warnings:

  - Made the column `shipScheduleId` on table `FreightRate` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FreightRate" DROP CONSTRAINT "FreightRate_shipScheduleId_fkey";

-- AlterTable
ALTER TABLE "FreightRate" ALTER COLUMN "shipScheduleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_shipScheduleId_fkey" FOREIGN KEY ("shipScheduleId") REFERENCES "ShipSchedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
