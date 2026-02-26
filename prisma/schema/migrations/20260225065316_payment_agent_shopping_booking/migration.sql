-- AlterTable
ALTER TABLE "ShoppingBooking" ADD COLUMN     "paymentAgentId" INTEGER,
ADD COLUMN     "paymentMethod" "PaymentMethod";

-- AddForeignKey
ALTER TABLE "ShoppingBooking" ADD CONSTRAINT "ShoppingBooking_paymentAgentId_fkey" FOREIGN KEY ("paymentAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
