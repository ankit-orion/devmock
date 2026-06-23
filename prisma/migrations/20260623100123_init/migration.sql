-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'MIXED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('JUNIOR', 'MID', 'SENIOR');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "RoundStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuestionSource" AS ENUM ('BANK', 'GENERATED', 'RESUME_BASED');

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT NOT NULL,
    "jobDescription" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MID',
    "focus" "InterviewType" NOT NULL DEFAULT 'MIXED',
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "resumeId" TEXT,
    "currentRound" INTEGER NOT NULL DEFAULT 0,
    "overallScore" INTEGER,
    "verdict" TEXT,
    "summary" TEXT,
    "categoryScores" JSONB,
    "strengths" JSONB,
    "improvements" JSONB,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InterviewType" NOT NULL,
    "focusAreas" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "targetCount" INTEGER NOT NULL DEFAULT 1,
    "status" "RoundStatus" NOT NULL DEFAULT 'PENDING',
    "score" INTEGER,
    "feedback" TEXT,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "parentQuestionId" TEXT,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "category" TEXT,
    "source" "QuestionSource" NOT NULL DEFAULT 'GENERATED',

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "score" INTEGER,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT,
    "rawText" TEXT NOT NULL,
    "parsedSkills" JSONB,
    "parsedProjects" JSONB,
    "parsedExperience" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyInterviewTemplate" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "rounds" JSONB NOT NULL,
    "notes" TEXT,

    CONSTRAINT "CompanyInterviewTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionBankEntry" (
    "id" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT,
    "category" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "QuestionBankEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewSession_userId_idx" ON "InterviewSession"("userId");

-- CreateIndex
CREATE INDEX "Round_sessionId_idx" ON "Round"("sessionId");

-- CreateIndex
CREATE INDEX "Question_roundId_idx" ON "Question"("roundId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_key" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInterviewTemplate_company_key" ON "CompanyInterviewTemplate"("company");

-- CreateIndex
CREATE INDEX "QuestionBankEntry_company_category_idx" ON "QuestionBankEntry"("company", "category");

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentQuestionId_fkey" FOREIGN KEY ("parentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
