/*
  Warnings:

  - Changed the type of `paymentMethod` on the `Purchase` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodForPurchase" AS ENUM ('ALIPAY', 'WECHAT', 'BANK_TRANSFER', 'CASH', 'OTHER');

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethodForPurchase" NOT NULL;
