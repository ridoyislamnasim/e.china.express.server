/*
  Warnings:

  - You are about to drop the column `agentId` on the `ShipmentBookingItems` table. All the data in the column will be lost.
  - The `mainStatus` column on the `ShoppingBooking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'CASH_ON_DELIVERY', 'MOBILE_PAYMENT', 'AGENT_PAYMENT');

-- CreateEnum
CREATE TYPE "OrderMainStatus" AS ENUM ('PENDING', 'APPROVE', 'CANCELLED_BY_CUSTOMER', 'SOURCING', 'SOURCED', 'PRICE_CHECKING', 'PRICE_CONFIRMED', 'PURCHASEING', 'PURCHASED', 'WAITING_PAYMENT', 'PAID', 'ORDER_PLACED', 'PROCESSING', 'FAILED', 'PICKED_UP', 'IN_TRANSIT_LOCAL_ORIGIN', 'PARTIALLY_RECEIVED_AT_WAREHOUSE', 'DAMAGED', 'RECEIVED_AT_WAREHOUSE', 'STORED', 'REJECTED_AT_WAREHOUSE');

-- DropForeignKey
ALTER TABLE "ShipmentBookingItems" DROP CONSTRAINT "ShipmentBookingItems_agentId_fkey";

-- AlterTable
ALTER TABLE "ShipmentBookingItems" DROP COLUMN "agentId",
ADD COLUMN     "paymentAgentId" INTEGER,
ADD COLUMN     "paymentMethod" "PaymentMethod";

-- AlterTable
ALTER TABLE "ShoppingBooking" DROP COLUMN "mainStatus",
ADD COLUMN     "mainStatus" "OrderMainStatus";

-- AddForeignKey
ALTER TABLE "ShipmentBookingItems" ADD CONSTRAINT "ShipmentBookingItems_paymentAgentId_fkey" FOREIGN KEY ("paymentAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
