/*
  Warnings:

  - You are about to drop the column `destinationCountry` on the `InventoryBooking` table. All the data in the column will be lost.
  - You are about to drop the column `originCountry` on the `InventoryBooking` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCountry` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `originCountry` on the `ShipmentBooking` table. All the data in the column will be lost.
  - You are about to drop the column `destinationCountry` on the `ShoppingBooking` table. All the data in the column will be lost.
  - You are about to drop the column `originCountry` on the `ShoppingBooking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InventoryBooking" DROP COLUMN "destinationCountry",
DROP COLUMN "originCountry";

-- AlterTable
ALTER TABLE "ShipmentBooking" DROP COLUMN "destinationCountry",
DROP COLUMN "originCountry";

-- AlterTable
ALTER TABLE "ShoppingBooking" DROP COLUMN "destinationCountry",
DROP COLUMN "originCountry";
