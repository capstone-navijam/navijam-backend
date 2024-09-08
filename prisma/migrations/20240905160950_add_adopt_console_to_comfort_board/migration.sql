-- AlterTable
ALTER TABLE "comfort_board" ADD COLUMN     "adoptConsoleId" BIGINT,
ALTER COLUMN "created_at" SET DEFAULT NOW();
