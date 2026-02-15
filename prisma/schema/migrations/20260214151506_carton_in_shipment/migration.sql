/*
  Warnings:

  - You are about to drop the column `discount` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ShipmentBooking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[categoryId]` on the table `ShipmentBooking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "discount",
DROP COLUMN "discountType",
DROP COLUMN "price",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "packageDiscount" DECIMAL(10,2),
ADD COLUMN     "packageDiscountType" "DiscountType",
ADD COLUMN     "shippingDiscount" DECIMAL(10,2),
ADD COLUMN     "shippingDiscountType" "DiscountType",
ADD COLUMN     "shippingMark" TEXT,
ADD COLUMN     "shippingPrice" DECIMAL(10,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "LocalDeliveryInfo" (
    "id" SERIAL NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "deliveryAddress" TEXT NOT NULL,
    "specialInstructions" TEXT,
    "shipmentBookingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalDeliveryInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentCarton" (
    "id" SERIAL NOT NULL,
    "shipmentBookingId" INTEGER NOT NULL,
    "cartonNumber" INTEGER NOT NULL,
    "widthCm" DECIMAL(10,2) NOT NULL,
    "heightCm" DECIMAL(10,2) NOT NULL,
    "lengthCm" DECIMAL(10,2) NOT NULL,
    "cbm" DECIMAL(10,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentCarton_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalDeliveryInfo_shipmentBookingId_key" ON "LocalDeliveryInfo"("shipmentBookingId");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentCarton_shipmentBookingId_cartonNumber_key" ON "ShipmentCarton"("shipmentBookingId", "cartonNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentBooking_categoryId_key" ON "ShipmentBooking"("categoryId");

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalDeliveryInfo" ADD CONSTRAINT "LocalDeliveryInfo_shipmentBookingId_fkey" FOREIGN KEY ("shipmentBookingId") REFERENCES "ShipmentBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentCarton" ADD CONSTRAINT "ShipmentCarton_shipmentBookingId_fkey" FOREIGN KEY ("shipmentBookingId") REFERENCES "ShipmentBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
