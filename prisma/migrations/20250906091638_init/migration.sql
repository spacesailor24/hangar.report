-- CreateEnum
CREATE TYPE "public"."TransmissionType" AS ENUM ('NEWS', 'LEAK', 'OFFICIAL', 'RUMOR');

-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('SHIPS', 'WEAPONS', 'GEAR', 'MEDICAL', 'GAMEPLAY', 'ECONOMY', 'LOCATIONS', 'LORE', 'MOB', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Transmission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "type" "public"."TransmissionType" NOT NULL,
    "categories" "public"."Category"[],
    "sourceUrl" TEXT,
    "sourceAuthor" TEXT,
    "isHighlight" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TopicTransmission" (
    "topicId" TEXT NOT NULL,
    "transmissionId" TEXT NOT NULL,
    "relevance" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "TopicTransmission_pkey" PRIMARY KEY ("topicId","transmissionId")
);

-- CreateTable
CREATE TABLE "public"."_TagToTransmission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToTransmission_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Transmission_publishedAt_idx" ON "public"."Transmission"("publishedAt");

-- CreateIndex
CREATE INDEX "Transmission_type_idx" ON "public"."Transmission"("type");

-- CreateIndex
CREATE INDEX "Transmission_isHighlight_idx" ON "public"."Transmission"("isHighlight");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "public"."Topic"("name");

-- CreateIndex
CREATE INDEX "Topic_parentId_idx" ON "public"."Topic"("parentId");

-- CreateIndex
CREATE INDEX "_TagToTransmission_B_index" ON "public"."_TagToTransmission"("B");

-- AddForeignKey
ALTER TABLE "public"."Topic" ADD CONSTRAINT "Topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicTransmission" ADD CONSTRAINT "TopicTransmission_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TopicTransmission" ADD CONSTRAINT "TopicTransmission_transmissionId_fkey" FOREIGN KEY ("transmissionId") REFERENCES "public"."Transmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTransmission" ADD CONSTRAINT "_TagToTransmission_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTransmission" ADD CONSTRAINT "_TagToTransmission_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Transmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
