/*
  Warnings:

  - You are about to drop the column `finalPrice` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "finalPrice",
ADD COLUMN     "discountedPackagingCharge" DECIMAL(10,2);
