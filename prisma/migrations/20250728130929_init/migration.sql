-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" SERIAL NOT NULL,
    "userRefId" INTEGER,
    "productRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseTransfer" (
    "id" SERIAL NOT NULL,
    "fromWarehouseRefId" INTEGER NOT NULL,
    "toWarehouseRefId" INTEGER NOT NULL,
    "inventoryRefId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "bannerImage" TEXT,
    "slug" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "categoryRefId" INTEGER,
    "viewType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingMethod" (
    "id" SERIAL NOT NULL,
    "shippingMethod" TEXT,
    "rate" DOUBLE PRECISION,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "managerRefId" INTEGER,
    "contact" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubChildCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "slug" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "childCategoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubChildCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "slug" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "subCategoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "name" TEXT,
    "rating" INTEGER,
    "comment" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "userRefId" INTEGER,
    "productRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" TEXT,
    "name" TEXT,
    "description" TEXT,
    "isDiscounted" BOOLEAN NOT NULL DEFAULT false,
    "discountType" TEXT,
    "discount" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "thumbnailImage" TEXT NOT NULL,
    "backViewImage" TEXT,
    "images" TEXT[],
    "sizeChartImage" TEXT,
    "videoUrl" TEXT,
    "status" TEXT,
    "slug" TEXT,
    "freeShipping" BOOLEAN NOT NULL DEFAULT false,
    "brandRefId" INTEGER,
    "mainInventory" INTEGER,
    "gender" TEXT,
    "inventoryType" TEXT,
    "categoryRefId" INTEGER,
    "subCategoryRefId" INTEGER,
    "childCategoryRefId" INTEGER,
    "subChildCategoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" SERIAL NOT NULL,
    "details" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentServiceConfig" (
    "id" SERIAL NOT NULL,
    "serviceMethod" TEXT DEFAULT 'STEADFAST',
    "baseUrl" TEXT,
    "userName" TEXT,
    "apiKey" TEXT,
    "secretKey" TEXT,
    "clientKey" TEXT,
    "clientId" TEXT,
    "clientSecret" TEXT,
    "email" TEXT,
    "password" TEXT,
    "grantType" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentServiceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "subTotalPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "shippingCost" DOUBLE PRECISION DEFAULT 0,
    "couponRefId" INTEGER,
    "userRefId" INTEGER,
    "correlationId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "customerCity" TEXT,
    "customerAddress" TEXT,
    "customerHouse" TEXT,
    "customerRoad" TEXT,
    "customerThana" TEXT,
    "customerAltPhone" TEXT,
    "paymentMethod" TEXT DEFAULT 'CashOnDelivery',
    "couponDiscount" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT DEFAULT 'OrderPlaced',
    "isGuestUser" BOOLEAN NOT NULL DEFAULT false,
    "guestUserRef" TEXT,
    "note" TEXT,
    "isCourierSend" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderBulk" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "companyName" TEXT,
    "productType" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "quantity" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderBulk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" SERIAL NOT NULL,
    "code" TEXT,
    "discount" DOUBLE PRECISION,
    "useLimit" INTEGER DEFAULT 0,
    "used" INTEGER DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "expireDate" TIMESTAMP(3),
    "discountType" TEXT,
    "brandRefId" INTEGER,
    "categoryRefId" INTEGER,
    "subCategoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "productRefId" INTEGER,
    "warehouseRefId" INTEGER,
    "quantity" INTEGER,
    "mrpPrice" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "discountType" TEXT,
    "discount" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "barcode" TEXT,
    "availableQuantity" INTEGER,
    "soldQuantity" INTEGER DEFAULT 0,
    "holdQuantity" INTEGER DEFAULT 0,
    "inventoryType" TEXT,
    "color" TEXT,
    "name" TEXT,
    "level" TEXT,
    "inventoryID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "vectorImage" TEXT,
    "colorCode" TEXT,
    "slug" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER,
    "isGuestUser" BOOLEAN NOT NULL DEFAULT false,
    "guestUserRef" TEXT,
    "userRefId" INTEGER,
    "productRefId" INTEGER,
    "inventoryRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "couponRefId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogTag" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "title" TEXT,
    "slug" TEXT,
    "author" TEXT,
    "details" TEXT,
    "tags" TEXT[],
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "slug" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" SERIAL NOT NULL,
    "header" TEXT,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutUs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_fromWarehouseRefId_fkey" FOREIGN KEY ("fromWarehouseRefId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_toWarehouseRefId_fkey" FOREIGN KEY ("toWarehouseRefId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_inventoryRefId_fkey" FOREIGN KEY ("inventoryRefId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryRefId_fkey" FOREIGN KEY ("categoryRefId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_managerRefId_fkey" FOREIGN KEY ("managerRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubChildCategory" ADD CONSTRAINT "SubChildCategory_childCategoryRefId_fkey" FOREIGN KEY ("childCategoryRefId") REFERENCES "ChildCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildCategory" ADD CONSTRAINT "ChildCategory_subCategoryRefId_fkey" FOREIGN KEY ("subCategoryRefId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandRefId_fkey" FOREIGN KEY ("brandRefId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryRefId_fkey" FOREIGN KEY ("categoryRefId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryRefId_fkey" FOREIGN KEY ("subCategoryRefId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_childCategoryRefId_fkey" FOREIGN KEY ("childCategoryRefId") REFERENCES "ChildCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subChildCategoryRefId_fkey" FOREIGN KEY ("subChildCategoryRefId") REFERENCES "SubChildCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponRefId_fkey" FOREIGN KEY ("couponRefId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_brandRefId_fkey" FOREIGN KEY ("brandRefId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_categoryRefId_fkey" FOREIGN KEY ("categoryRefId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_subCategoryRefId_fkey" FOREIGN KEY ("subCategoryRefId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_warehouseRefId_fkey" FOREIGN KEY ("warehouseRefId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_inventoryRefId_fkey" FOREIGN KEY ("inventoryRefId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_couponRefId_fkey" FOREIGN KEY ("couponRefId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
