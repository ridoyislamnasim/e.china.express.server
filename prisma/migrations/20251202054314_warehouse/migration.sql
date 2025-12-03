/*
  Warnings:

  - The primary key for the `WarehouseTransfer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'CLOSED', 'OVERLOADED', 'UNDER_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('DISTRIBUTION_CENTER', 'FULFILLMENT_CENTER', 'COLD_STORAGE', 'BONDED', 'RETAIL', 'MANUFACTURING', 'CROSS_DOCK');

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_managerRefId_fkey";

-- DropForeignKey
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseTransfer" DROP CONSTRAINT "WarehouseTransfer_fromWarehouseRefId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseTransfer" DROP CONSTRAINT "WarehouseTransfer_toWarehouseRefId_fkey";

-- AlterTable
ALTER TABLE "WarehouseTransfer" DROP CONSTRAINT "WarehouseTransfer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "fromWarehouseRefId" SET DATA TYPE TEXT,
ALTER COLUMN "toWarehouseRefId" SET DATA TYPE TEXT,
ADD CONSTRAINT "WarehouseTransfer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WarehouseTransfer_id_seq";

-- DropTable
DROP TABLE "Warehouse";

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'USA',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "location" TEXT,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "type" "WarehouseType" NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "usedCapacity" INTEGER NOT NULL DEFAULT 0,
    "capacityUnit" TEXT NOT NULL DEFAULT 'sq ft',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "weekdaysHours" TEXT,
    "weekendsHours" TEXT,
    "holidaysHours" TEXT,
    "lastInspection" TIMESTAMP(3),
    "nextMaintenance" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "managerRefId" INTEGER,
    "countryId" INTEGER,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_name_key" ON "warehouses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_fromWarehouseRefId_fkey" FOREIGN KEY ("fromWarehouseRefId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_toWarehouseRefId_fkey" FOREIGN KEY ("toWarehouseRefId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_managerRefId_fkey" FOREIGN KEY ("managerRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
