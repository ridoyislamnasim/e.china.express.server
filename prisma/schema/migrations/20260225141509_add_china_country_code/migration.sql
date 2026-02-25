/*
  Warnings:

  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coumtryCode" TEXT NOT NULL DEFAULT '+86',
ALTER COLUMN "phone" SET NOT NULL;
