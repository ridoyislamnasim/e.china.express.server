/*
  Warnings:

  - You are about to drop the column `shipScheduleId` on the `ShipRoute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShipRoute" DROP CONSTRAINT "ShipRoute_shipScheduleId_fkey";

-- AlterTable
ALTER TABLE "ShipRoute" DROP COLUMN "shipScheduleId";

-- AlterTable
ALTER TABLE "ShipSchedule" ADD COLUMN     "shipRouteId" INTEGER;

-- AddForeignKey
ALTER TABLE "ShipSchedule" ADD CONSTRAINT "ShipSchedule_shipRouteId_fkey" FOREIGN KEY ("shipRouteId") REFERENCES "ShipRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
