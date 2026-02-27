/*
  Warnings:

  - The values [PURCHASEING] on the enum `OrderMainStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderMainStatus_new" AS ENUM ('PENDING', 'APPROVE', 'CANCELLED_BY_CUSTOMER', 'SOURCING', 'SOURCED', 'PRICE_CHECKING', 'PRICE_CONFIRMED', 'PURCHASING', 'PURCHASED', 'WAITING_PAYMENT', 'PAID', 'ORDER_PLACED', 'PROCESSING', 'FAILED', 'PICKED_UP', 'IN_TRANSIT_LOCAL_ORIGIN', 'PARTIALLY_RECEIVED_AT_WAREHOUSE', 'DAMAGED', 'RECEIVED_AT_WAREHOUSE', 'STORED', 'REJECTED_AT_WAREHOUSE');
ALTER TABLE "ShoppingBooking" ALTER COLUMN "mainStatus" TYPE "OrderMainStatus_new" USING ("mainStatus"::text::"OrderMainStatus_new");
ALTER TYPE "OrderMainStatus" RENAME TO "OrderMainStatus_old";
ALTER TYPE "OrderMainStatus_new" RENAME TO "OrderMainStatus";
DROP TYPE "public"."OrderMainStatus_old";
COMMIT;
