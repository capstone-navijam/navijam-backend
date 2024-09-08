-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "console" ADD COLUMN     "isAdopted" BOOLEAN NOT NULL DEFAULT false;
