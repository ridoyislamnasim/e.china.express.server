-- CreateTable
CREATE TABLE "PolicyType" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PolicyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "notHelpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "policyTypeId" INTEGER NOT NULL,

    CONSTRAINT "Policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PolicyType_title_key" ON "PolicyType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "PolicyType_slug_key" ON "PolicyType"("slug");

-- AddForeignKey
ALTER TABLE "Policies" ADD CONSTRAINT "Policies_policyTypeId_fkey" FOREIGN KEY ("policyTypeId") REFERENCES "PolicyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
