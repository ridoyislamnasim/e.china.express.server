-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "warehouseId" INTEGER,
    "isoCode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
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
    "cbm" DECIMAL(65,30) NOT NULL,
    "status" "Status" NOT NULL,
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
    "route_name" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CountryCombination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rate" (
    "id" SERIAL NOT NULL,
    "countryCombinationId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "shippingMethodId" INTEGER NOT NULL,
    "weightCategoryId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_exportCountryId_fkey" FOREIGN KEY ("exportCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryCombination" ADD CONSTRAINT "CountryCombination_importCountryId_fkey" FOREIGN KEY ("importCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_countryCombinationId_fkey" FOREIGN KEY ("countryCombinationId") REFERENCES "CountryCombination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "RateProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateSippingMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rate" ADD CONSTRAINT "Rate_weightCategoryId_fkey" FOREIGN KEY ("weightCategoryId") REFERENCES "RateWeightCategorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
