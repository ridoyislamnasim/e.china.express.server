/*
  Warnings:

  - Added the required column `carrierCompanyId` to the `FreightRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FreightRate" ADD COLUMN     "carrierCompanyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_carrierCompanyId_fkey" FOREIGN KEY ("carrierCompanyId") REFERENCES "CarrierCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
