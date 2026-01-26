-- CreateEnum
CREATE TYPE "CargoType" AS ENUM ('DG', 'NON_DG');

-- CreateEnum
CREATE TYPE "ShipmentMode" AS ENUM ('FCL', 'LCL');

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "isFreight" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "FreightRate" (
    "id" SERIAL NOT NULL,
    "routeId" INTEGER NOT NULL,
    "cargoType" "CargoType" NOT NULL,
    "shipmentMode" "ShipmentMode" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "cbm" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FreightRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Container" (
    "id" SERIAL NOT NULL,
    "freightRateId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ship" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipRoute" (
    "id" SERIAL NOT NULL,
    "shipId" INTEGER NOT NULL,
    "fromPortId" INTEGER NOT NULL,
    "toPortId" INTEGER NOT NULL,
    "shipScheduileId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipSchedule" (
    "id" SERIAL NOT NULL,
    "sailingDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FreightRate" ADD CONSTRAINT "FreightRate_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "ShipRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Container" ADD CONSTRAINT "Container_freightRateId_fkey" FOREIGN KEY ("freightRateId") REFERENCES "FreightRate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_shipScheduileId_fkey" FOREIGN KEY ("shipScheduileId") REFERENCES "ShipSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_shipId_fkey" FOREIGN KEY ("shipId") REFERENCES "Ship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_fromPortId_fkey" FOREIGN KEY ("fromPortId") REFERENCES "Ports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipRoute" ADD CONSTRAINT "ShipRoute_toPortId_fkey" FOREIGN KEY ("toPortId") REFERENCES "Ports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
