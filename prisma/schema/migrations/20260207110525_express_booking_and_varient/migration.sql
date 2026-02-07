-- AlterTable
ALTER TABLE "BookingProductVariant" ADD COLUMN     "colorHex" TEXT,
ADD COLUMN     "colorName" TEXT,
ADD COLUMN     "shipmentBookingId" INTEGER,
ADD COLUMN     "sizeName" TEXT,
ALTER COLUMN "bookingProductId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShipmentBooking" ADD COLUMN     "expressRateId" INTEGER,
ADD COLUMN     "freightRateId" INTEGER;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_expressRateId_fkey" FOREIGN KEY ("expressRateId") REFERENCES "ExpressRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_freightRateId_fkey" FOREIGN KEY ("freightRateId") REFERENCES "FreightRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingProductVariant" ADD CONSTRAINT "BookingProductVariant_shipmentBookingId_fkey" FOREIGN KEY ("shipmentBookingId") REFERENCES "ShipmentBooking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
