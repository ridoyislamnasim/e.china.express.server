-- AlterTable
ALTER TABLE "ShipmentBooking" ADD COLUMN     "shippingMethodId" INTEGER;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
