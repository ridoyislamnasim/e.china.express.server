/*
  Warnings:

  - You are about to drop the column `discountedPackagingCharge` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `discountedPrice` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "discountedPackagingCharge",
DROP COLUMN "discountedPrice",
ADD COLUMN     "brandingCharge" DECIMAL(10,2),
ADD COLUMN     "brandingDiscount" DECIMAL(10,2),
ADD COLUMN     "brandingDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "brandingDiscountType" "DiscountType",
ADD COLUMN     "packagingDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "shippingDiscountAmount" DECIMAL(10,2) DEFAULT 0;
