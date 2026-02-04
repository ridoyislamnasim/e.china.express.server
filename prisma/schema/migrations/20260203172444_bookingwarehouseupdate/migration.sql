/*
  Warnings:

  - You are about to drop the column `inportCountryId` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `inportWarehouseId` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_inportCountryId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_inportWarehouseId_fkey";

-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "inportCountryId",
DROP COLUMN "inportWarehouseId",
ADD COLUMN     "importCountryId" INTEGER,
ADD COLUMN     "importWarehouseId" TEXT,
ADD COLUMN     "warehouseReceivingNote" TEXT,
ALTER COLUMN "trackingNumber" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_importCountryId_fkey" FOREIGN KEY ("importCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_importWarehouseId_fkey" FOREIGN KEY ("importWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
