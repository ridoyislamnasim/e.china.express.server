/*
  Warnings:

  - You are about to drop the `air_spaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `express_spaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sea_spaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_inventory_x` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_inventory_y` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_inventory_z` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[warehouseSpaceId,type]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SpaceType" AS ENUM ('AIR', 'SEA', 'EXPRESS');

-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('TYPE_X', 'TYPE_Y', 'TYPE_Z');

-- DropForeignKey
ALTER TABLE "air_spaces" DROP CONSTRAINT "air_spaces_warehouseSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "express_spaces" DROP CONSTRAINT "express_spaces_warehouseSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "sea_spaces" DROP CONSTRAINT "sea_spaces_warehouseSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "sub_inventory_x" DROP CONSTRAINT "sub_inventory_x_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "sub_inventory_y" DROP CONSTRAINT "sub_inventory_y_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "sub_inventory_z" DROP CONSTRAINT "sub_inventory_z_inventoryId_fkey";

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "fixedCbm" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "spaceNumber" INTEGER,
ADD COLUMN     "type" "InventoryType" NOT NULL;

-- DropTable
DROP TABLE "air_spaces";

-- DropTable
DROP TABLE "express_spaces";

-- DropTable
DROP TABLE "sea_spaces";

-- DropTable
DROP TABLE "sub_inventory_x";

-- DropTable
DROP TABLE "sub_inventory_y";

-- DropTable
DROP TABLE "sub_inventory_z";

-- CreateTable
CREATE TABLE "spaces" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "type" "SpaceType" NOT NULL,
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

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "spaces_warehouseSpaceId_idx" ON "spaces"("warehouseSpaceId");

-- CreateIndex
CREATE INDEX "spaces_type_idx" ON "spaces"("type");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_warehouseSpaceId_type_spaceId_key" ON "spaces"("warehouseSpaceId", "type", "spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_warehouseSpaceId_type_spaceNumber_key" ON "spaces"("warehouseSpaceId", "type", "spaceNumber");

-- CreateIndex
CREATE INDEX "inventories_type_idx" ON "inventories"("type");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_warehouseSpaceId_type_key" ON "inventories"("warehouseSpaceId", "type");

-- CreateIndex
CREATE INDEX "space_activities_createdAt_idx" ON "space_activities"("createdAt");

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_warehouseSpaceId_fkey" FOREIGN KEY ("warehouseSpaceId") REFERENCES "warehouse_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_activities" ADD CONSTRAINT "space_activities_space_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_activities" ADD CONSTRAINT "space_activities_inventory_fkey" FOREIGN KEY ("spaceId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
