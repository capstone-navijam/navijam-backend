-- AlterTable
ALTER TABLE "chat_room" ADD COLUMN     "is_enabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();
