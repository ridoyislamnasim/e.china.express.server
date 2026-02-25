/*
  Warnings:

  - The `category` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WalletCategory" AS ENUM ('personal', 'local');

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "category",
ADD COLUMN     "category" "WalletCategory";
