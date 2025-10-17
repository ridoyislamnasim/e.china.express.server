-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('customer', 'user', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'customer';
