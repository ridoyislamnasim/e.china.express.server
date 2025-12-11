/*
  Warnings:

  - You are about to drop the column `Confirm` on the `CartProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CartProduct" DROP COLUMN "Confirm",
ADD COLUMN     "confirm" BOOLEAN NOT NULL DEFAULT false;
