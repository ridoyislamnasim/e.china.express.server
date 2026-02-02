-- AlterTable
ALTER TABLE "ShipmentBooking" ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "packageQuantity" INTEGER DEFAULT 1,
ADD COLUMN     "packagingCharge" DECIMAL(10,2);

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;
