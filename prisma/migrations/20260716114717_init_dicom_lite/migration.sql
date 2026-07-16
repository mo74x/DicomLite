-- CreateTable
CREATE TABLE "studies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "patientId" VARCHAR(100) NOT NULL,
    "patientName" VARCHAR(255),
    "studyInstanceUid" VARCHAR(255) NOT NULL,
    "modality" VARCHAR(50) NOT NULL,
    "studyDate" DATE,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "studies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "studies_studyInstanceUid_key" ON "studies"("studyInstanceUid");

-- CreateIndex
CREATE INDEX "studies_patientId_idx" ON "studies"("patientId");

-- CreateIndex
CREATE INDEX "studies_modality_idx" ON "studies"("modality");
