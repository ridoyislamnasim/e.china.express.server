/*
  Warnings:

  - You are about to drop the column `freightRateId` on the `Container` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Container` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Container` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Container` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `containerClass` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lengthFt` to the `Container` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContainerClass" AS ENUM ('DRY', 'HIGH_CUBE', 'REEFER', 'OPEN_TOP', 'FLAT_RACK');

-- DropForeignKey
ALTER TABLE "Container" DROP CONSTRAINT "Container_freightRateId_fkey";

-- AlterTable
ALTER TABLE "Container" DROP COLUMN "freightRateId",
DROP COLUMN "quantity",
DROP COLUMN "size",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "containerClass" "ContainerClass" NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "heightFt" DECIMAL(4,2),
ADD COLUMN     "internalVolumeCbm" DECIMAL(6,2),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isHazmatAllowed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isReefer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lengthFt" INTEGER NOT NULL,
ADD COLUMN     "maxPayloadKg" INTEGER,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tareWeightKg" INTEGER,
ADD COLUMN     "widthFt" DECIMAL(4,2);

-- AlterTable
ALTER TABLE "FreightRate" ADD COLUMN     "containerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Container_code_key" ON "Container"("code");

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Container"("id") ON DELETE SET NULL ON UPDATE CASCADE;
