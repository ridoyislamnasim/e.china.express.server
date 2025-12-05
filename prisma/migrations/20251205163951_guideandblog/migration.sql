-- CreateTable
CREATE TABLE "Guide" (
    "id" SERIAL NOT NULL,
    "serial" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideVideo" (
    "id" SERIAL NOT NULL,
    "guideId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "imgSrc" TEXT,
    "videoLength" TEXT,
    "title" TEXT,
    "shortDes" TEXT,
    "videoSerial" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GuideVideo" ADD CONSTRAINT "GuideVideo_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
