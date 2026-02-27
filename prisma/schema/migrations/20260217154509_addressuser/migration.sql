/*
  Warnings:

  - You are about to drop the column `addressId` on the `User` table. All the data in the column will be lost.
  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultAddress` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addressId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressId";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultAddress" BOOLEAN NOT NULL,
ADD COLUMN     "house" TEXT,
ADD COLUMN     "recipientName" TEXT,
ADD COLUMN     "recipientPhone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "zipCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
