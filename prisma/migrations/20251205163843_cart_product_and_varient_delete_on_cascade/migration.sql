/*
  Warnings:

  - You are about to drop the `Guide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GuideVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartProductVariant" DROP CONSTRAINT "CartProductVariant_cartProductId_fkey";

-- DropForeignKey
ALTER TABLE "GuideVideo" DROP CONSTRAINT "GuideVideo_guideId_fkey";

-- DropTable
DROP TABLE "Guide";

-- DropTable
DROP TABLE "GuideVideo";

-- AddForeignKey
ALTER TABLE "CartProductVariant" ADD CONSTRAINT "CartProductVariant_cartProductId_fkey" FOREIGN KEY ("cartProductId") REFERENCES "CartProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
