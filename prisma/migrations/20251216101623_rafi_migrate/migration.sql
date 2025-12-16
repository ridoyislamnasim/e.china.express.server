/*
  Warnings:

  - Added the required column `industryId` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "industryId" INTEGER NOT NULL,
ADD COLUMN     "tagId" INTEGER NOT NULL,
ADD COLUMN     "topicId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Industry" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Industry_slug_key" ON "Industry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BlogTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
