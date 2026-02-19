-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('AVAILABLE', 'PARTIAL', 'FULL', 'BLOCKED');

-- AlterTable
ALTER TABLE "ShipmentBooking" ADD COLUMN     "spaceCapacity" INTEGER,
ADD COLUMN     "spaceId" TEXT;

-- AlterTable
ALTER TABLE "spaces" ADD COLUMN     "status" "SpaceStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "usedCapacity" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
