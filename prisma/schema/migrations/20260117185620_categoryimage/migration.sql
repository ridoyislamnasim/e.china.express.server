/*
  Warnings:

  - You are about to drop the `RateSippingMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_shippingMethodId_fkey";

-- DropTable
DROP TABLE "RateSippingMethod";

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
