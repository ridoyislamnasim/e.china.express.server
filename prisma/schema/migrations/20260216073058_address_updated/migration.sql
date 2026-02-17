/*
  Warnings:

  - Added the required column `address` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `house` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "house" TEXT NOT NULL;
