/*
  Warnings:

  - The `category` column on the `Wallet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "WalletCategory" AS ENUM ('personal', 'local');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Currency" ADD VALUE 'INA';
ALTER TYPE "Currency" ADD VALUE 'PAK';
ALTER TYPE "Currency" ADD VALUE 'BDT';
ALTER TYPE "Currency" ADD VALUE 'SUA';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "category",
ADD COLUMN     "category" "WalletCategory";
