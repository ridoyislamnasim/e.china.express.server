/*
  Warnings:

  - You are about to drop the column `productShippingId` on the `ShipmentBookingItems` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rateId]` on the table `ProductShipping` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingProductId]` on the table `ProductShipping` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ShipmentBookingItems" DROP CONSTRAINT "ShipmentBookingItems_productShippingId_fkey";

-- AlterTable
ALTER TABLE "ProductShipping" ADD COLUMN     "bookingProductId" INTEGER,
ADD COLUMN     "rateId" INTEGER;

-- AlterTable
ALTER TABLE "ShipmentBookingItems" DROP COLUMN "productShippingId";

-- CreateIndex
CREATE UNIQUE INDEX "ProductShipping_rateId_key" ON "ProductShipping"("rateId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductShipping_bookingProductId_key" ON "ProductShipping"("bookingProductId");

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "Rate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_bookingProductId_fkey" FOREIGN KEY ("bookingProductId") REFERENCES "ShipmentBookingItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
