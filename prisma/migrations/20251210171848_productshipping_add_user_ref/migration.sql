-- AlterTable
ALTER TABLE "ProductShipping" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProductShipping" ADD CONSTRAINT "ProductShipping_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
