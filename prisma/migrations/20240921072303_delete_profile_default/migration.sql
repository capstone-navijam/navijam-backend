-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "member" ALTER COLUMN "profile" DROP DEFAULT,
ALTER COLUMN "profile" SET DATA TYPE VARCHAR(256);
