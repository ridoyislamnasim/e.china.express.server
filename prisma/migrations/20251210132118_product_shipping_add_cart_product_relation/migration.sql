/*
  Warnings:

  - Added the required column `cartProductId` to the `ProductShipping` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductShipping" ADD COLUMN     "cartProductId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_cartProductId_fkey" FOREIGN KEY ("cartProductId") REFERENCES "CartProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
