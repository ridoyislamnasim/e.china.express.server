-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_exportCountryId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_exportWarehouseId_fkey";

-- AlterTable
ALTER TABLE "ShipmentBooking" ALTER COLUMN "exportCountryId" DROP NOT NULL,
ALTER COLUMN "exportWarehouseId" DROP NOT NULL,
ALTER COLUMN "bookingNo" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_exportCountryId_fkey" FOREIGN KEY ("exportCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_exportWarehouseId_fkey" FOREIGN KEY ("exportWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
