/*
  Warnings:

  - You are about to drop the column `total_cbm` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "total_cbm",
ADD COLUMN     "totalCBM" DECIMAL(10,2);
