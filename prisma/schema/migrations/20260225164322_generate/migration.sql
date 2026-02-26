-- CreateTable
CREATE TABLE "SizeMeasurementType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeMeasurementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SizeMeasurement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sizeMeasurementId" INTEGER NOT NULL,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SizeMeasurementType_title_key" ON "SizeMeasurementType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SizeMeasurementType_slug_key" ON "SizeMeasurementType"("slug");

-- AddForeignKey
ALTER TABLE "SizeMeasurement" ADD CONSTRAINT "SizeMeasurement_sizeMeasurementId_fkey" FOREIGN KEY ("sizeMeasurementId") REFERENCES "SizeMeasurementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
