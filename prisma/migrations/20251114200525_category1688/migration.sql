-- CreateTable
CREATE TABLE "Category1688" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "chineseName" TEXT,
    "translatedName" TEXT,
    "language" TEXT,
    "imageUrl" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "leaf" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER NOT NULL DEFAULT 0,
    "parentCateId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category1688_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category1688_categoryId_key" ON "Category1688"("categoryId");

-- AddForeignKey
ALTER TABLE "Category1688" ADD CONSTRAINT "Category1688_parentCateId_fkey" FOREIGN KEY ("parentCateId") REFERENCES "Category1688"("categoryId") ON DELETE SET NULL ON UPDATE CASCADE;
