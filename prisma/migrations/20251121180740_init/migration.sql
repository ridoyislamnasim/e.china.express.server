/*
  Warnings:

  - You are about to drop the column `categoryId` on the `CountryHsCode` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `CountryHsCode` table. All the data in the column will be lost.
  - Added the required column `category1688Id` to the `CountryHsCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `CountryHsCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CountryHsCode" DROP CONSTRAINT "CountryHsCode_categoryId_fkey";

-- AlterTable
ALTER TABLE "CountryHsCode" DROP COLUMN "categoryId",
DROP COLUMN "country",
ADD COLUMN     "category1688Id" INTEGER NOT NULL,
ADD COLUMN     "countryId" INTEGER NOT NULL,
ALTER COLUMN "hsCodes" SET NOT NULL,
ALTER COLUMN "hsCodes" DROP DEFAULT,
ALTER COLUMN "hsCodes" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "HsCodeConfig" ALTER COLUMN "globalHsCodes" SET NOT NULL,
ALTER COLUMN "globalHsCodes" DROP DEFAULT,
ALTER COLUMN "globalHsCodes" SET DATA TYPE TEXT,
ALTER COLUMN "chinaHsCodes" SET NOT NULL,
ALTER COLUMN "chinaHsCodes" DROP DEFAULT,
ALTER COLUMN "chinaHsCodes" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "CountryHsCode" ADD CONSTRAINT "CountryHsCode_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryHsCode" ADD CONSTRAINT "CountryHsCode_category1688Id_fkey" FOREIGN KEY ("category1688Id") REFERENCES "Category1688"("id") ON DELETE CASCADE ON UPDATE CASCADE;
