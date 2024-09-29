-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" ALTER COLUMN "contact_number" DROP DEFAULT;
