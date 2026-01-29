/*
  Warnings:

  - You are about to drop the `Ship` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CarrierType" AS ENUM ('SEA', 'AIR');

-- DropForeignKey
ALTER TABLE "ShipRoute" DROP CONSTRAINT "ShipRoute_shipId_fkey";

-- AlterTable
ALTER TABLE "ShipRoute" ADD COLUMN     "carrierCompanyId" INTEGER;

-- DropTable
DROP TABLE "Ship";

-- CreateTable
CREATE TABLE "CarrierCompany" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "code" TEXT,
    "carrierType" "CarrierType" NOT NULL,
    "scacCode" TEXT,
    "iataCode" TEXT,
    "icaoCode" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarrierCompany_code_key" ON "CarrierCompany"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierCompany_scacCode_key" ON "CarrierCompany"("scacCode");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierCompany_iataCode_key" ON "CarrierCompany"("iataCode");

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_carrierCompanyId_fkey" FOREIGN KEY ("carrierCompanyId") REFERENCES "CarrierCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;
