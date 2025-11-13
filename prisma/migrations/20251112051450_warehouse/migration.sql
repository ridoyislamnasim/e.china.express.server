/*
  Warnings:

  - You are about to drop the column `cbm` on the `RateProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RateProduct" DROP COLUMN "cbm";

-- CreateTable
CREATE TABLE "RateShippingMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RateShippingMethod_name_key" ON "RateShippingMethod"("name");
