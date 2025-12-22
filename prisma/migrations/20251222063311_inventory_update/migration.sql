/*
  Warnings:

  - A unique constraint covering the columns `[warehouseSpaceId,type,code]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouseSpaceId,type,spaceNumber]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "inventories_warehouseSpaceId_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "inventories_warehouseSpaceId_type_code_key" ON "inventories"("warehouseSpaceId", "type", "code");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_warehouseSpaceId_type_spaceNumber_key" ON "inventories"("warehouseSpaceId", "type", "spaceNumber");
