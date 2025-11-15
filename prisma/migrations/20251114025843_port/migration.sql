-- CreateEnum
CREATE TYPE "PortType" AS ENUM ('Sea', 'Air', 'Land');

-- CreateTable
CREATE TABLE "Ports" (
    "id" SERIAL NOT NULL,
    "portName" VARCHAR(100) NOT NULL,
    "portType" "PortType" NOT NULL DEFAULT 'Sea',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "Ports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ports" ADD CONSTRAINT "Ports_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
