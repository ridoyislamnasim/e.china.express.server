/*
  Warnings:

  - Added the required column `defaultAddress` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "defaultAddress" BOOLEAN NOT NULL,
ADD COLUMN     "recipientName" TEXT NOT NULL,
ADD COLUMN     "recipientPhone" TEXT NOT NULL;
