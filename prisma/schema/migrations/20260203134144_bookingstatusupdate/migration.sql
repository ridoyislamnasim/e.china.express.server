/*
  Warnings:

  - The values [IN_TRANSIT,ARRIVED,RECEIVING,RECEIVED,PARTIALLY_RECEIVED,REJECTED,RETURNED_TO_SUPPLIER,CANCELLED] on the enum `WarehouseReceivingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `ShipmentBooking` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE');

-- CreateEnum
CREATE TYPE "MainStatus" AS ENUM ('PENDING', 'APPROVE', 'CANCELLED_BY_CUSTOMER', 'PICKED_UP', 'IN_TRANSIT_LOCAL_ORIGIN', 'PARTIALLY_RECEIVED_AT_WAREHOUSE', 'DAMAGED', 'RECEIVED_AT_WAREHOUSE', 'STORED', 'REJECTED_AT_WAREHOUSE');

-- AlterEnum
BEGIN;
CREATE TYPE "WarehouseReceivingStatus_new" AS ENUM ('PENDING', 'APPROVE', 'CANCELLED_BY_CUSTOMER', 'PICKED_UP', 'IN_TRANSIT_LOCAL_ORIGIN', 'PARTIALLY_RECEIVED_AT_WAREHOUSE', 'DAMAGED', 'RECEIVED_AT_WAREHOUSE', 'STORED', 'REJECTED_AT_WAREHOUSE');
ALTER TABLE "ShipmentBooking" ALTER COLUMN "warehouseReceivingStatus" TYPE "WarehouseReceivingStatus_new" USING ("warehouseReceivingStatus"::text::"WarehouseReceivingStatus_new");
ALTER TABLE "ShoppingBooking" ALTER COLUMN "warehouseReceivingStatus" TYPE "WarehouseReceivingStatus_new" USING ("warehouseReceivingStatus"::text::"WarehouseReceivingStatus_new");
ALTER TABLE "InventoryBooking" ALTER COLUMN "warehouseReceivingStatus" TYPE "WarehouseReceivingStatus_new" USING ("warehouseReceivingStatus"::text::"WarehouseReceivingStatus_new");
ALTER TYPE "WarehouseReceivingStatus" RENAME TO "WarehouseReceivingStatus_old";
ALTER TYPE "WarehouseReceivingStatus_new" RENAME TO "WarehouseReceivingStatus";
DROP TYPE "public"."WarehouseReceivingStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "status",
ADD COLUMN     "mainStatus" "MainStatus";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "BookingLog" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "action" "LogAction" NOT NULL,
    "changes" JSONB NOT NULL,
    "message" TEXT,
    "performedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingLog_pkey" PRIMARY KEY ("id")
);
