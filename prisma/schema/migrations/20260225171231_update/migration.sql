/*
  Warnings:

  - You are about to drop the column `coumtryCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "coumtryCode",
ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '';
