/*
  Warnings:

  - You are about to drop the column `discount` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `importCountryId` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `importWarehouseId` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `totalCbm` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `totalProductCost` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `totalWeightkg` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `exportCountry` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `exportWarehouse` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `finalPrice` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `importCountry` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `importWarehouse` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the `CompanyContacts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[warehouseSpaceId,type,spaceNumber]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[warehouseSpaceId,type,spaceNumber]` on the table `spaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destinationCountry` to the `InventoryBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originCountry` to the `InventoryBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCountry` to the `ShipmentBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inportCountryId` to the `ShipmentBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inportWarehouseId` to the `ShipmentBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originCountry` to the `ShipmentBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCountry` to the `ShoppingBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originCountry` to the `ShoppingBooking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse` to the `ShoppingBooking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_importCountryId_fkey";

-- DropForeignKey
ALTER TABLE "ShipmentBooking" DROP CONSTRAINT "ShipmentBooking_importWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_exportCountry_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_exportWarehouse_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_importCountry_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingBooking" DROP CONSTRAINT "ShoppingBooking_importWarehouse_fkey";

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "emergencyHotlines" TEXT,
ADD COLUMN     "phones" TEXT;

-- AlterTable
ALTER TABLE "InventoryBooking" ADD COLUMN     "destinationCountry" TEXT NOT NULL,
ADD COLUMN     "originCountry" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "permissionAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissionCreate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissionDelete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "permissionUpdate" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "discount",
DROP COLUMN "discountType",
DROP COLUMN "finalPrice",
DROP COLUMN "importCountryId",
DROP COLUMN "importWarehouseId",
DROP COLUMN "price",
DROP COLUMN "totalCbm",
DROP COLUMN "totalProductCost",
DROP COLUMN "totalWeightkg",
ADD COLUMN     "destinationCountry" TEXT NOT NULL,
ADD COLUMN     "inportCountryId" INTEGER NOT NULL,
ADD COLUMN     "inportWarehouseId" TEXT NOT NULL,
ADD COLUMN     "originCountry" TEXT NOT NULL,
ADD COLUMN     "total_cbm" DECIMAL(10,2),
ADD COLUMN     "total_product_cost" DECIMAL(10,2),
ADD COLUMN     "total_weight_kg" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ShoppingBooking" DROP COLUMN "discount",
DROP COLUMN "discountType",
DROP COLUMN "exportCountry",
DROP COLUMN "exportWarehouse",
DROP COLUMN "finalPrice",
DROP COLUMN "importCountry",
DROP COLUMN "importWarehouse",
DROP COLUMN "price",
ADD COLUMN     "destinationCountry" TEXT NOT NULL,
ADD COLUMN     "originCountry" TEXT NOT NULL,
ADD COLUMN     "warehouse" TEXT NOT NULL;

-- DropTable
DROP TABLE "CompanyContacts";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cartId" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'Dollar',
    "orderNumber" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "remarks" TEXT,
    "totalWeight" DECIMAL(10,3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "titleTrans" TEXT,
    "productFor" "ProductFor" NOT NULL,
    "product1688Id" TEXT,
    "productLocalId" INTEGER,
    "productAlibabaId" TEXT,
    "vendorId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "totalPrice" DECIMAL(12,2) NOT NULL,
    "totalWeight" DECIMAL(10,3) NOT NULL,
    "variants" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderShipping" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "shippingMethodId" INTEGER,
    "fromCountryId" INTEGER,
    "toCountryId" INTEGER,
    "totalQuantity" INTEGER NOT NULL,
    "approxWeight" DECIMAL(10,3) NOT NULL,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "customDuty" DECIMAL(12,2) NOT NULL,
    "vat" DECIMAL(6,2) NOT NULL,
    "handlingFee" DECIMAL(12,2) NOT NULL,
    "packagingFee" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL,
    "finalPayable" DECIMAL(12,2) NOT NULL,
    "estDeliveryDays" INTEGER,
    "trackingNumber" TEXT,
    "trackingURL" TEXT,
    "shippingStatus" "ShippingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderShipping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductShipping" (
    "id" SERIAL NOT NULL,
    "cartId" INTEGER NOT NULL,
    "cartProductId" INTEGER NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_warehouseSpaceId_type_spaceNumber_key" ON "inventories"("warehouseSpaceId", "type", "spaceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_warehouseSpaceId_type_spaceNumber_key" ON "spaces"("warehouseSpaceId", "type", "spaceNumber");

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_inportCountryId_fkey" FOREIGN KEY ("inportCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBooking" ADD CONSTRAINT "ShipmentBooking_inportWarehouseId_fkey" FOREIGN KEY ("inportWarehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_warehouse_fkey" FOREIGN KEY ("warehouse") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderShipping" ADD CONSTRAINT "OrderShipping_fromCountryId_fkey" FOREIGN KEY ("fromCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderShipping" ADD CONSTRAINT "OrderShipping_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderShipping" ADD CONSTRAINT "OrderShipping_toCountryId_fkey" FOREIGN KEY ("toCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_cartProductId_fkey" FOREIGN KEY ("cartProductId") REFERENCES "CartProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_fromCountryId_fkey" FOREIGN KEY ("fromCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_toCountryId_fkey" FOREIGN KEY ("toCountryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
