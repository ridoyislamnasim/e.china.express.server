-- AlterTable
ALTER TABLE "FreightRate" ADD COLUMN     "shipScheduleId" INTEGER;

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_shipScheduleId_fkey" FOREIGN KEY ("shipScheduleId") REFERENCES "ShipSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
