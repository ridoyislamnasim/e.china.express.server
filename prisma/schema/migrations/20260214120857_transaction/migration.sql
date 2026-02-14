/*
  Warnings:

  - You are about to drop the column `date` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `merchant` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - The `currency` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `fromId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('LOCAL', 'CURRENCY', 'RUPEE', 'EXPENSE');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- DropIndex
DROP INDEX "Transaction_walletId_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "date",
DROP COLUMN "description",
DROP COLUMN "merchant",
DROP COLUMN "status",
DROP COLUMN "type",
DROP COLUMN "walletId",
ADD COLUMN     "buyRate" DECIMAL(18,4),
ADD COLUMN     "fromId" INTEGER NOT NULL,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "sellRate" DECIMAL(18,4),
ADD COLUMN     "toId" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2),
DROP COLUMN "currency",
ADD COLUMN     "currency" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "TransactionCategory" NOT NULL;

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_fromId_idx" ON "Transaction"("fromId");

-- CreateIndex
CREATE INDEX "Transaction_toId_idx" ON "Transaction"("toId");

-- CreateIndex
CREATE INDEX "Transaction_category_idx" ON "Transaction"("category");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
