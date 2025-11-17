/*
  Warnings:

  - You are about to drop the column `productId` on the `Rate` table. All the data in the column will be lost.
  - Added the required column `category1688Id` to the `Rate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_productId_fkey";

-- AlterTable
ALTER TABLE "Rate" DROP COLUMN "productId",
ADD COLUMN     "category1688Id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_category1688Id_fkey" FOREIGN KEY ("category1688Id") REFERENCES "Category1688"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
