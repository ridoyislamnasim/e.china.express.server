/*
  Warnings:

  - You are about to drop the column `rate` on the `BookingProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `shippingRateId` on the `BookingProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `ProductShipping` table. All the data in the column will be lost.
  - You are about to drop the column `cartProductId` on the `ProductShipping` table. All the data in the column will be lost.
  - You are about to drop the column `rateId` on the `ProductShipping` table. All the data in the column will be lost.
  - You are about to drop the column `customer` on the `ShipmentBookingItems` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ShipmentBookingItems` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the `BookingAddress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `ShoppingBooking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `ShoppingBooking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderNumber` to the `ShoppingBooking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BookingAddress" DROP CONSTRAINT "BookingAddress_inventoryBookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingAddress" DROP CONSTRAINT "BookingAddress_shipmentBookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingAddress" DROP CONSTRAINT "BookingAddress_shoppingBookingId_fkey";

-- DropForeignKey
ALTER TABLE "ProductShipping" DROP CONSTRAINT "ProductShipping_cartId_fkey";

-- DropForeignKey
ALTER TABLE "ProductShipping" DROP CONSTRAINT "ProductShipping_cartProductId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentBookingItems" DROP CONSTRAINT "ShipmentBookingItems_customer_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentBookingItems" DROP CONSTRAINT "ShipmentBookingItems_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_supplier_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_warehouse_fkey";

-- AlterTable
ALTER TABLE "BookingProductVariant" DROP COLUMN "rate",
DROP COLUMN "shippingRateId";

-- AlterTable
ALTER TABLE "ProductShipping" DROP COLUMN "cartId",
DROP COLUMN "cartProductId",
DROP COLUMN "rateId";

-- AlterTable
ALTER TABLE "ShipmentBookingItems" DROP COLUMN "customer",
DROP COLUMN "productId",
ADD COLUMN     "calculatedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "mainSkuImageUrl" TEXT,
ADD COLUMN     "product1688Id" TEXT,
ADD COLUMN     "productAlibabaId" TEXT,
ADD COLUMN     "productLocalId" INTEGER,
ADD COLUMN     "productShippingId" INTEGER,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "vendorId" INTEGER;

-- AlterTable
ALTER TABLE "ShoppingBooking" DROP COLUMN "supplier",
DROP COLUMN "userId",
DROP COLUMN "warehouse",
ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "brandingCharge" DECIMAL(10,2),
ADD COLUMN     "brandingDiscount" DECIMAL(10,2),
ADD COLUMN     "brandingDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "brandingDiscountType" "DiscountType",
ADD COLUMN     "exportCountryId" INTEGER,
ADD COLUMN     "exportWarehouseId" TEXT,
ADD COLUMN     "importCountryId" INTEGER,
ADD COLUMN     "importWarehouseId" TEXT,
ADD COLUMN     "mainStatus" "MainStatus",
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "packageDiscount" DECIMAL(10,2),
ADD COLUMN     "packageDiscountType" "DiscountType",
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "packageQuantity" INTEGER DEFAULT 1,
ADD COLUMN     "packagingCharge" DECIMAL(10,2),
ADD COLUMN     "packagingDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
ADD COLUMN     "productCostDiscount" DECIMAL(10,2),
ADD COLUMN     "productCostDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "productCostDiscountType" "DiscountType",
ADD COLUMN     "shippingDiscount" DECIMAL(10,2),
ADD COLUMN     "shippingDiscountAmount" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "shippingDiscountType" "DiscountType",
ADD COLUMN     "shippingMark" TEXT,
ADD COLUMN     "shippingPrice" DECIMAL(10,2),
ADD COLUMN     "supplierId" INTEGER,
ADD COLUMN     "totalProductCost" DECIMAL(10,2),
ADD COLUMN     "warehouseReceivingNote" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL,
ALTER COLUMN "bookingNo" DROP NOT NULL,
ALTER COLUMN "bookingDate" DROP NOT NULL,
ALTER COLUMN "trackingNumber" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "BookingAddress";

-- CreateTable
CREATE TABLE "BookingProductPriceRange" (
    "id" SERIAL NOT NULL,
    "startQuantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "bookingProductId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingProductPriceRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingBooking_orderNumber_key" ON "ShoppingBooking"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingBooking_addressId_key" ON "ShoppingBooking"("addressId");

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_exportCountryId_fkey" FOREIGN KEY ("exportCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_importCountryId_fkey" FOREIGN KEY ("importCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_exportWarehouseId_fkey" FOREIGN KEY ("exportWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_importWarehouseId_fkey" FOREIGN KEY ("importWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBookingItems" ADD CONSTRAINT "ShipmentBookingItems_productLocalId_fkey" FOREIGN KEY ("productLocalId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBookingItems" ADD CONSTRAINT "ShipmentBookingItems_productShippingId_fkey" FOREIGN KEY ("productShippingId") REFERENCES "ProductShipping"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBookingItems" ADD CONSTRAINT "ShipmentBookingItems_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingProductPriceRange" ADD CONSTRAINT "BookingProductPriceRange_bookingProductId_fkey" FOREIGN KEY ("bookingProductId") REFERENCES "ShipmentBookingItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
