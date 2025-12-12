/*
  Warnings:

  - You are about to drop the column `inventoryRefId` on the `BuyNowCart` table. All the data in the column will be lost.
  - The primary key for the `warehouse_spaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `capacity` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `currentUsage` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `spaceCode` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `spaceName` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to drop the column `spaceNumber` on the `warehouse_spaces` table. All the data in the column will be lost.
  - You are about to alter the column `totalCapacity` on the `warehouse_spaces` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[warehouseId]` on the table `warehouse_spaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `warehouse_spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `warehouse_spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `warehouse_spaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BuyNowCart" DROP CONSTRAINT "BuyNowCart_inventoryRefId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productRefId_fkey";

-- AlterTable
ALTER TABLE "BuyNowCart" DROP COLUMN "inventoryRefId";

-- AlterTable
ALTER TABLE "warehouse_spaces" DROP CONSTRAINT "warehouse_spaces_pkey",
DROP COLUMN "capacity",
DROP COLUMN "created_at",
DROP COLUMN "currentUsage",
DROP COLUMN "sectionId",
DROP COLUMN "spaceCode",
DROP COLUMN "spaceName",
DROP COLUMN "spaceNumber",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "warehouseId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "totalCapacity" SET DATA TYPE INTEGER,
ADD CONSTRAINT "warehouse_spaces_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "warehouse_spaces_id_seq";

-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "air_spaces" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseSpaceId" TEXT NOT NULL,

    CONSTRAINT "air_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sea_spaces" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseSpaceId" TEXT NOT NULL,

    CONSTRAINT "sea_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "express_spaces" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseSpaceId" TEXT NOT NULL,

    CONSTRAINT "express_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Inventory',
    "description" TEXT,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseSpaceId" TEXT NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_inventory_x" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER,
    "fixedCbm" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "sub_inventory_x_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_inventory_y" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER,
    "fixedCbm" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "sub_inventory_y_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_inventory_z" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT,
    "duration" TEXT,
    "occupied" BOOLEAN DEFAULT false,
    "spaceNumber" INTEGER,
    "capacity" INTEGER,
    "fixedCbm" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "sub_inventory_z_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_activities" (
    "id" TEXT NOT NULL,
    "spaceType" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "warehouseId" TEXT NOT NULL,

    CONSTRAINT "space_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "air_spaces_warehouseSpaceId_idx" ON "air_spaces"("warehouseSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "air_spaces_warehouseSpaceId_spaceId_key" ON "air_spaces"("warehouseSpaceId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "air_spaces_warehouseSpaceId_spaceNumber_key" ON "air_spaces"("warehouseSpaceId", "spaceNumber");

-- CreateIndex
CREATE INDEX "sea_spaces_warehouseSpaceId_idx" ON "sea_spaces"("warehouseSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "sea_spaces_warehouseSpaceId_spaceId_key" ON "sea_spaces"("warehouseSpaceId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "sea_spaces_warehouseSpaceId_spaceNumber_key" ON "sea_spaces"("warehouseSpaceId", "spaceNumber");

-- CreateIndex
CREATE INDEX "express_spaces_warehouseSpaceId_idx" ON "express_spaces"("warehouseSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "express_spaces_warehouseSpaceId_spaceId_key" ON "express_spaces"("warehouseSpaceId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "express_spaces_warehouseSpaceId_spaceNumber_key" ON "express_spaces"("warehouseSpaceId", "spaceNumber");

-- CreateIndex
CREATE INDEX "inventories_warehouseSpaceId_idx" ON "inventories"("warehouseSpaceId");

-- CreateIndex
CREATE INDEX "sub_inventory_x_inventoryId_idx" ON "sub_inventory_x"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_x_inventoryId_spaceId_key" ON "sub_inventory_x"("inventoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_x_inventoryId_spaceNumber_key" ON "sub_inventory_x"("inventoryId", "spaceNumber");

-- CreateIndex
CREATE INDEX "sub_inventory_y_inventoryId_idx" ON "sub_inventory_y"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_y_inventoryId_spaceId_key" ON "sub_inventory_y"("inventoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_y_inventoryId_spaceNumber_key" ON "sub_inventory_y"("inventoryId", "spaceNumber");

-- CreateIndex
CREATE INDEX "sub_inventory_z_inventoryId_idx" ON "sub_inventory_z"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_z_inventoryId_spaceId_key" ON "sub_inventory_z"("inventoryId", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_inventory_z_inventoryId_spaceNumber_key" ON "sub_inventory_z"("inventoryId", "spaceNumber");

-- CreateIndex
CREATE INDEX "space_activities_warehouseId_spaceType_spaceId_idx" ON "space_activities"("warehouseId", "spaceType", "spaceId");

-- CreateIndex
CREATE INDEX "warehouse_spaces_warehouseId_idx" ON "warehouse_spaces"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_spaces_warehouseId_key" ON "warehouse_spaces"("warehouseId");

-- AddForeignKey
ALTER TABLE "warehouse_spaces" ADD CONSTRAINT "warehouse_spaces_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "air_spaces" ADD CONSTRAINT "air_spaces_warehouseSpaceId_fkey" FOREIGN KEY ("warehouseSpaceId") REFERENCES "warehouse_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sea_spaces" ADD CONSTRAINT "sea_spaces_warehouseSpaceId_fkey" FOREIGN KEY ("warehouseSpaceId") REFERENCES "warehouse_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "express_spaces" ADD CONSTRAINT "express_spaces_warehouseSpaceId_fkey" FOREIGN KEY ("warehouseSpaceId") REFERENCES "warehouse_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_warehouseSpaceId_fkey" FOREIGN KEY ("warehouseSpaceId") REFERENCES "warehouse_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_inventory_x" ADD CONSTRAINT "sub_inventory_x_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_inventory_y" ADD CONSTRAINT "sub_inventory_y_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_inventory_z" ADD CONSTRAINT "sub_inventory_z_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_activities" ADD CONSTRAINT "space_activities_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
