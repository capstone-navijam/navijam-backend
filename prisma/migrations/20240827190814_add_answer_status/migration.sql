-- AlterTable
ALTER TABLE "comfort_board" ADD COLUMN     "isAnswered" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET DEFAULT NOW();
