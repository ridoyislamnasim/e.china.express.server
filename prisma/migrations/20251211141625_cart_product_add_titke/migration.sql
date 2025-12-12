-- AlterTable
ALTER TABLE "CartProduct" ADD COLUMN     "calculatedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "titleTrans" TEXT;

-- AlterTable
ALTER TABLE "CartProductVariant" ADD COLUMN     "amountOnSale" INTEGER;
