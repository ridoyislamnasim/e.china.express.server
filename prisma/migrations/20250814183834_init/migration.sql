-- CreateTable
CREATE TABLE "BuyNowCart" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER,
    "isGuestUser" BOOLEAN NOT NULL DEFAULT false,
    "guestUserRef" TEXT,
    "correlationId" TEXT,
    "userRefId" INTEGER,
    "productRefId" INTEGER,
    "inventoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyNowCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BuyNowCart_correlationId_key" ON "BuyNowCart"("correlationId");

-- AddForeignKey
ALTER TABLE "BuyNowCart" ADD CONSTRAINT "BuyNowCart_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyNowCart" ADD CONSTRAINT "BuyNowCart_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyNowCart" ADD CONSTRAINT "BuyNowCart_inventoryRefId_fkey" FOREIGN KEY ("inventoryRefId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
