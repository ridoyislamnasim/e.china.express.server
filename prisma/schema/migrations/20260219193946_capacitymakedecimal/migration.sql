/*
  Warnings:

  - You are about to alter the column `capacity` on the `spaces` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `usedCapacity` on the `spaces` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "spaces" ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "capacity" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "usedCapacity" DROP NOT NULL,
ALTER COLUMN "usedCapacity" SET DEFAULT 0,
ALTER COLUMN "usedCapacity" SET DATA TYPE DECIMAL(10,2);
