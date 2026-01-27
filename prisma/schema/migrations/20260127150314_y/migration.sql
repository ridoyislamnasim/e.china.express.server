/*
  Warnings:

  - You are about to drop the column `shipScheduileId` on the `ShipRoute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShipRoute" DROP CONSTRAINT "ShipRoute_shipScheduileId_fkey";

-- AlterTable
ALTER TABLE "ShipRoute" DROP COLUMN "shipScheduileId",
ADD COLUMN     "shipScheduleId" INTEGER;

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_shipScheduleId_fkey" FOREIGN KEY ("shipScheduleId") REFERENCES "ShipSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
