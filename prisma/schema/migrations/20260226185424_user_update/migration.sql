-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currencyCode" VARCHAR(10),
ADD COLUMN     "currencyName" VARCHAR(100),
ADD COLUMN     "currencySymbol" VARCHAR(10),
ADD COLUMN     "language" VARCHAR(10),
ADD COLUMN     "languageName" VARCHAR(100);
