-- DropForeignKey
ALTER TABLE "CountryCombination" DROP CONSTRAINT "CountryCombination_exportCountryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryCombination" DROP CONSTRAINT "CountryCombination_importCountryId_fkey";

-- AddForeignKey
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_exportCountryId_fkey" FOREIGN KEY ("exportCountryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_importCountryId_fkey" FOREIGN KEY ("importCountryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
