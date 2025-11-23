/*
  Warnings:

  - A unique constraint covering the columns `[hsCodeConfigId]` on the table `Category1688` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category1688" ADD COLUMN     "hsCodeConfigId" INTEGER;

-- CreateTable
CREATE TABLE "HsCodeConfig" (
    "id" SERIAL NOT NULL,
    "globalHsCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chinaHsCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "globalMaterialComment" TEXT,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HsCodeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryHsCode" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "hsCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryHsCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HsCodeConfig_categoryId_key" ON "HsCodeConfig"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category1688_hsCodeConfigId_key" ON "Category1688"("hsCodeConfigId");

-- AddForeignKey
ALTER TABLE "HsCodeConfig" ADD CONSTRAINT "HsCodeConfig_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category1688"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryHsCode" ADD CONSTRAINT "CountryHsCode_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category1688"("id") ON DELETE CASCADE ON UPDATE CASCADE;
