/*
  Warnings:

  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[SKU]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "SKU" TEXT,
ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "discountAmount" DOUBLE PRECISION,
ADD COLUMN     "mrpPrice" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Product_SKU_key" ON "Product"("SKU");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
