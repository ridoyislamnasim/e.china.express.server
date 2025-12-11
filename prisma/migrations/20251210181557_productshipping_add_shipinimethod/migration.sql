-- DropForeignKey
ALTER TABLE "ProductShipping" DROP CONSTRAINT "ProductShipping_shippingMethodId_fkey";

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_shippingMethodId_fkey" FOREIGN KEY ("shippingMethodId") REFERENCES "RateShippingMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
