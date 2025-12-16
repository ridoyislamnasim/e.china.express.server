/*
  Warnings:

  - The values [DISTRIBUTION,STORAGE,FULFILLMENT,OTHERS] on the enum `WarehouseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WarehouseType_new" AS ENUM ('DISTRIBUTION_CENTER', 'COLD_STORAGE', 'FULFILLMENT_CENTER', 'BONDED', 'MANUFACTURING', 'CROSS_DOCK');
ALTER TABLE "warehouses" ALTER COLUMN "type" TYPE "WarehouseType_new" USING ("type"::text::"WarehouseType_new");
ALTER TYPE "WarehouseType" RENAME TO "WarehouseType_old";
ALTER TYPE "WarehouseType_new" RENAME TO "WarehouseType";
DROP TYPE "WarehouseType_old";
COMMIT;
