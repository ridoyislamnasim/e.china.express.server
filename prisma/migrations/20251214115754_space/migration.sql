/*
  Warnings:

  - You are about to drop the `space_activities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "space_activities" DROP CONSTRAINT "space_activities_inventory_fkey";

-- DropForeignKey
ALTER TABLE "space_activities" DROP CONSTRAINT "space_activities_space_fkey";

-- DropForeignKey
ALTER TABLE "space_activities" DROP CONSTRAINT "space_activities_warehouseId_fkey";

-- DropTable
DROP TABLE "space_activities";
