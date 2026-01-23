-- AlterTable
ALTER TABLE "ShipmentBooking" ADD COLUMN     "discount" DECIMAL(10,2),
ADD COLUMN     "discountType" "DiscountType",
ADD COLUMN     "discountedPrice" DECIMAL(10,2),
ADD COLUMN     "finalPrice" DECIMAL(10,2),
ADD COLUMN     "price" DECIMAL(10,2);
