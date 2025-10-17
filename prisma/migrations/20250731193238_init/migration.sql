/*
  Warnings:

  - You are about to drop the column `viewType` on the `SubCategory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `SubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "viewType";

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_slug_key" ON "SubCategory"("slug");
