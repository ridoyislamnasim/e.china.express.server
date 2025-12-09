-- DropForeignKey
ALTER TABLE "CartProduct" DROP CONSTRAINT "CartProduct_productLocalId_fkey";

-- AddForeignKey
ALTER TABLE "CartProduct" ADD CONSTRAINT "CartProduct_productLocalId_fkey" FOREIGN KEY ("productLocalId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
