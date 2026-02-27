-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category1688"("id") ON DELETE SET NULL ON UPDATE CASCADE;
