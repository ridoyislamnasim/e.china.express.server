-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'user', 'admin');

-- CreateEnum
CREATE TYPE "PortType" AS ENUM ('Sea', 'Air', 'Land');

-- CreateEnum
CREATE TYPE "ProductFor" AS ENUM ('FROM1688', 'LOCAL', 'ALIBABA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "roleId" INTEGER,
    "addressId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "permissionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "aboutUsAccess" BOOLEAN NOT NULL DEFAULT false,
    "aboutUsCreate" BOOLEAN NOT NULL DEFAULT false,
    "aboutUsUpdate" BOOLEAN NOT NULL DEFAULT false,
    "aboutUsDelete" BOOLEAN NOT NULL DEFAULT false,
    "bannerAccess" BOOLEAN NOT NULL DEFAULT false,
    "bannerCreate" BOOLEAN NOT NULL DEFAULT false,
    "bannerUpdate" BOOLEAN NOT NULL DEFAULT false,
    "bannerDelete" BOOLEAN NOT NULL DEFAULT false,
    "categoryAccess" BOOLEAN NOT NULL DEFAULT false,
    "categoryCreate" BOOLEAN NOT NULL DEFAULT false,
    "categoryUpdate" BOOLEAN NOT NULL DEFAULT false,
    "categoryDelete" BOOLEAN NOT NULL DEFAULT false,
    "subCategoryAccess" BOOLEAN NOT NULL DEFAULT false,
    "subCategoryCreate" BOOLEAN NOT NULL DEFAULT false,
    "subCategoryUpdate" BOOLEAN NOT NULL DEFAULT false,
    "subCategoryDelete" BOOLEAN NOT NULL DEFAULT false,
    "chilsCategoryAccess" BOOLEAN NOT NULL DEFAULT false,
    "chilsCategoryCreate" BOOLEAN NOT NULL DEFAULT false,
    "chilsCategoryUpdate" BOOLEAN NOT NULL DEFAULT false,
    "chilsCategoryDelete" BOOLEAN NOT NULL DEFAULT false,
    "orderAccess" BOOLEAN NOT NULL DEFAULT false,
    "orderCreate" BOOLEAN NOT NULL DEFAULT false,
    "orderUpdate" BOOLEAN NOT NULL DEFAULT false,
    "orderDelete" BOOLEAN NOT NULL DEFAULT false,
    "userAccess" BOOLEAN NOT NULL DEFAULT false,
    "userCreate" BOOLEAN NOT NULL DEFAULT false,
    "userUpdate" BOOLEAN NOT NULL DEFAULT false,
    "userDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
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
    "totalCapacity" DOUBLE PRECISION DEFAULT 0,
    "usedCapacity" DOUBLE PRECISION DEFAULT 0,
    "remaining" DOUBLE PRECISION DEFAULT 0,
    "location" TEXT,
    "managerRefId" INTEGER,
    "contact" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "countryId" INTEGER,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" TEXT,
    "SKU" TEXT,
    "name" TEXT,
    "description" TEXT,
    "isDiscounted" BOOLEAN NOT NULL DEFAULT false,
    "discountType" TEXT,
    "discount" DOUBLE PRECISION,
    "costPrice" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "mrpPrice" DOUBLE PRECISION,
    "discountAmount" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "thumbnailImage" TEXT NOT NULL,
    "backViewImage" TEXT,
    "images" TEXT[],
    "sizeChartImage" TEXT,
    "videoUrl" TEXT,
    "status" BOOLEAN DEFAULT true,
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
    "publishStatus" TEXT DEFAULT 'Publish',
    "viewProduct" INTEGER DEFAULT 0,

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

-- CreateTable
CREATE TABLE "OTP" (
    "id" SERIAL NOT NULL,
    "userRefId" INTEGER,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "bannerType" TEXT,
    "image" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateShippingMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateShippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isoCode" TEXT NOT NULL,
    "zone" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isShippingCountry" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ports" (
    "id" SERIAL NOT NULL,
    "portName" VARCHAR(100) NOT NULL,
    "portType" "PortType" NOT NULL DEFAULT 'Sea',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "Ports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateSippingMethod" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateSippingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categorie" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shCategoryCode" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategories" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER,
    "name" TEXT NOT NULL,
    "shSubCategoryCode" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubHeadings" (
    "id" SERIAL NOT NULL,
    "subcategoryId" INTEGER,
    "name" TEXT NOT NULL,
    "hsSubHeadingCode" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubHeadings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateProduct" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER,
    "subcategoryId" INTEGER,
    "subheadingId" INTEGER,
    "name" TEXT NOT NULL,
    "shCode" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateWeightCategorie" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "min_weight" DECIMAL(65,30) NOT NULL,
    "max_weight" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateWeightCategorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryCombination" (
    "id" SERIAL NOT NULL,
    "exportCountryId" INTEGER NOT NULL,
    "importCountryId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CountryCombination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" SERIAL NOT NULL,
    "countryCombinationId" INTEGER NOT NULL,
    "category1688Id" INTEGER NOT NULL,
    "shippingMethodId" INTEGER NOT NULL,
    "weightCategoryId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category1688" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "chineseName" TEXT,
    "translatedName" TEXT,
    "language" TEXT,
    "imageUrl" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "leaf" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isRateCategory" BOOLEAN NOT NULL DEFAULT false,
    "parentCateId" INTEGER,
    "hsCodeConfigId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category1688_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HsCodeConfig" (
    "id" SERIAL NOT NULL,
    "globalHsCodes" TEXT NOT NULL,
    "chinaHsCodes" TEXT NOT NULL,
    "globalMaterialComment" TEXT,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HsCodeConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryHsCode" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "hsCodes" TEXT NOT NULL,
    "category1688Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryHsCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalPrice" DOUBLE PRECISION DEFAULT 0,
    "totalWeight" DOUBLE PRECISION DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'Dollar',
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartProduct" (
    "id" SERIAL NOT NULL,
    "productFor" "ProductFor" NOT NULL DEFAULT 'FROM1688',
    "product1688Id" TEXT,
    "productLocalId" INTEGER,
    "productAlibabaId" TEXT,
    "mainSkuImageUrl" TEXT,
    "vendorId" INTEGER,
    "cartId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CartProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartProductVariant" (
    "id" SERIAL NOT NULL,
    "cartProductId" INTEGER NOT NULL,
    "skuId" TEXT,
    "specId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "attributeName" TEXT,
    "attributeNameSecond" TEXT,
    "weight" DOUBLE PRECISION,
    "dimensions" TEXT,
    "price" DOUBLE PRECISION,
    "skuImageUrl" TEXT,
    "shippingRateId" INTEGER,
    "rate" INTEGER,

    CONSTRAINT "CartProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_slug_key" ON "SubCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_SKU_key" ON "Product"("SKU");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BuyNowCart_correlationId_key" ON "BuyNowCart"("correlationId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RateShippingMethod_name_key" ON "RateShippingMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category1688_categoryId_key" ON "Category1688"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Category1688_hsCodeConfigId_key" ON "Category1688"("hsCodeConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "HsCodeConfig_categoryId_key" ON "HsCodeConfig"("categoryId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_fromWarehouseRefId_fkey" FOREIGN KEY ("fromWarehouseRefId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseTransfer" ADD CONSTRAINT "WarehouseTransfer_toWarehouseRefId_fkey" FOREIGN KEY ("toWarehouseRefId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryRefId_fkey" FOREIGN KEY ("categoryRefId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_managerRefId_fkey" FOREIGN KEY ("managerRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "BuyNowCart" ADD CONSTRAINT "BuyNowCart_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyNowCart" ADD CONSTRAINT "BuyNowCart_productRefId_fkey" FOREIGN KEY ("productRefId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_userRefId_fkey" FOREIGN KEY ("userRefId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_couponRefId_fkey" FOREIGN KEY ("couponRefId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ports" ADD CONSTRAINT "Ports_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategories" ADD CONSTRAINT "SubCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubHeadings" ADD CONSTRAINT "SubHeadings_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateProduct" ADD CONSTRAINT "RateProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateProduct" ADD CONSTRAINT "RateProduct_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateProduct" ADD CONSTRAINT "RateProduct_subheadingId_fkey" FOREIGN KEY ("subheadingId") REFERENCES "SubHeadings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_exportCountryId_fkey" FOREIGN KEY ("exportCountryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_importCountryId_fkey" FOREIGN KEY ("importCountryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_countryCombinationId_fkey" FOREIGN KEY ("countryCombinationId") REFERENCES "CountryCombination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_category1688Id_fkey" FOREIGN KEY ("category1688Id") REFERENCES "Category1688"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateSippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_weightCategoryId_fkey" FOREIGN KEY ("weightCategoryId") REFERENCES "RateWeightCategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category1688" ADD CONSTRAINT "Category1688_parentCateId_fkey" FOREIGN KEY ("parentCateId") REFERENCES "Category1688"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HsCodeConfig" ADD CONSTRAINT "HsCodeConfig_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category1688"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryHsCode" ADD CONSTRAINT "CountryHsCode_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryHsCode" ADD CONSTRAINT "CountryHsCode_category1688Id_fkey" FOREIGN KEY ("category1688Id") REFERENCES "Category1688"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_productLocalId_fkey" FOREIGN KEY ("productLocalId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductVariant" ADD CONSTRAINT "CartProductVariant_cartProductId_fkey" FOREIGN KEY ("cartProductId") REFERENCES "CartProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartProductVariant" ADD CONSTRAINT "CartProductVariant_shippingRateId_fkey" FOREIGN KEY ("shippingRateId") REFERENCES "Rate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
