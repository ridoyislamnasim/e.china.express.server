/*
  Warnings:

  - You are about to drop the column `total_product_cost` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `total_weight_kg` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "total_product_cost",
DROP COLUMN "total_weight_kg",
ADD COLUMN     "totalProductCost" DECIMAL(10,2),
ADD COLUMN     "totalWeightkg" DECIMAL(10,2);
