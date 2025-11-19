/*
  Warnings:

  - You are about to drop the column `warehouseId` on the `countries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "countries" DROP CONSTRAINT "countries_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Category1688" ADD COLUMN     "isRateCategory" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "countryId" INTEGER;

-- AlterTable
ALTER TABLE "countries" DROP COLUMN "warehouseId";

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
