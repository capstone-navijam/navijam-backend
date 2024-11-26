-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
