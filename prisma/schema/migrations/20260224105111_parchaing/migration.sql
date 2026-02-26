-- AlterTable
ALTER TABLE "ShipmentBookingItems" ADD COLUMN     "purchaseId" INTEGER;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "supplierName" TEXT NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "purchaseLink" TEXT,
    "sourcingPrice" DOUBLE PRECISION NOT NULL,
    "courierFee" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "purchaseImages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShipmentBookingItems" ADD CONSTRAINT "ShipmentBookingItems_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
