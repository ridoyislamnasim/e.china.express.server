/*
  Warnings:

  - A unique constraint covering the columns `[correlationId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "correlationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_correlationId_key" ON "Cart"("correlationId");
