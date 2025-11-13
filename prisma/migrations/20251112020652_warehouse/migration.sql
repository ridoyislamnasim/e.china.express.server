-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "remaining" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalCapacity" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "updatedBy" INTEGER,
ADD COLUMN     "usedCapacity" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "warehouse_spaces" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "spaceCode" VARCHAR(50) NOT NULL,
    "spaceName" VARCHAR(255) NOT NULL,
    "spaceNumber" INTEGER NOT NULL,
    "capacity" DECIMAL(10,2) NOT NULL,
    "totalCapacity" DECIMAL(10,2) NOT NULL,
    "currentUsage" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_spaces_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
