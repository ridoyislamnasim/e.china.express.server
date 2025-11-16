-- DropForeignKey
ALTER TABLE "Rate" DROP CONSTRAINT "Rate_countryCombinationId_fkey";

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_countryCombinationId_fkey" FOREIGN KEY ("countryCombinationId") REFERENCES "CountryCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;
