/*
  Warnings:

  - You are about to drop the `ShippingMethod` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "RateWeightCategorie" ADD COLUMN     "boxSize" TEXT;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "countryZoneId" INTEGER;

-- DropTable
DROP TABLE "ShippingMethod";

-- CreateTable
CREATE TABLE "CountryZone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "zondeCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpressRate" (
    "id" SERIAL NOT NULL,
    "countryZoneId" INTEGER NOT NULL,
    "weightCategoryId" INTEGER NOT NULL,
    "shippingMethodId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpressRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryZone_name_key" ON "CountryZone"("name");

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_countryZoneId_fkey" FOREIGN KEY ("countryZoneId") REFERENCES "CountryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressRate" ADD CONSTRAINT "ExpressRate_countryZoneId_fkey" FOREIGN KEY ("countryZoneId") REFERENCES "CountryZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressRate" ADD CONSTRAINT "ExpressRate_weightCategoryId_fkey" FOREIGN KEY ("weightCategoryId") REFERENCES "RateWeightCategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpressRate" ADD CONSTRAINT "ExpressRate_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
