/*
  Warnings:

  - A unique constraint covering the columns `[warehouseSpaceId,code]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "inventories_warehouseSpaceId_type_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "inventories_warehouseSpaceId_code_key" ON "inventories"("warehouseSpaceId", "code");
