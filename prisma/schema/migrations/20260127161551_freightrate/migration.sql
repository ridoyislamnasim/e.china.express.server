/*
  Warnings:

  - Added the required column `shippingMethodId` to the `FreightRate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FreightRate" ADD COLUMN     "shippingMethodId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
