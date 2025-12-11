-- CreateTable
CREATE TABLE "ProductShipping" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "rateId" INTEGER,
    "fromCountryId" INTEGER,
    "toCountryId" INTEGER,
    "totalQuantity" INTEGER NOT NULL DEFAULT 0,
    "approxWeight" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "weightRange" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "shippingMethodId" INTEGER,
    "totalCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "orderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "customDuty" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "vat" DECIMAL(6,2) NOT NULL DEFAULT 0,
    "handlingFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "packagingFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "finalPayable" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estDeliveryDays" INTEGER,
    "actualDeliveryDate" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "trackingURL" TEXT,
    "warehouseLocation" TEXT,
    "shippingStatus" TEXT NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductShipping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_rateId_fkey" FOREIGN KEY ("rateId") REFERENCES "Rate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_fromCountryId_fkey" FOREIGN KEY ("fromCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_toCountryId_fkey" FOREIGN KEY ("toCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
