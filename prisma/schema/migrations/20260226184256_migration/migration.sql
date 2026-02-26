/*
  Warnings:

  - You are about to drop the column `sizeMeasurementId` on the `SizeMeasurement` table. All the data in the column will be lost.
  - Added the required column `sizeMeasurementTypeId` to the `SizeMeasurement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SizeMeasurement" DROP CONSTRAINT "SizeMeasurement_sizeMeasurementId_fkey";

-- AlterTable
ALTER TABLE "SizeMeasurement" DROP COLUMN "sizeMeasurementId",
ADD COLUMN     "sizeMeasurementTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SizeMeasurement" ADD CONSTRAINT "SizeMeasurement_sizeMeasurementTypeId_fkey" FOREIGN KEY ("sizeMeasurementTypeId") REFERENCES "SizeMeasurementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
