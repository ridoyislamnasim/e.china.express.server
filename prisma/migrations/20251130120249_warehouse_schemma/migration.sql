/*
  Warnings:

  - You are about to drop the column `warehouseRefId` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarehouseTransfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WarehouseStatus" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'CLOSED', 'CONSTRUCTION', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('DISTRIBUTION', 'STORAGE', 'FULFILLMENT', 'OTHERS');

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_warehouseRefId_fkey";

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
ALTER TABLE "WarehouseTransfer" DROP CONSTRAINT "WarehouseTransfer_inventoryRefId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseTransfer" DROP CONSTRAINT "WarehouseTransfer_toWarehouseRefId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "warehouseRefId";

-- DropTable
DROP TABLE "Warehouse";

-- DropTable
DROP TABLE "WarehouseTransfer";

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
    "location" TEXT NOT NULL,
    "status" "WarehouseStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "type" "WarehouseType" NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "usedCapacity" INTEGER NOT NULL,
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
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_managerRefId_fkey" FOREIGN KEY ("managerRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
