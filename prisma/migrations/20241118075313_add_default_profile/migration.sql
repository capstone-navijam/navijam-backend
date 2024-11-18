-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "member" ALTER COLUMN "profile" SET DEFAULT 'https://navijam-bucket.s3.ap-northeast-2.amazonaws.com/images/profiles/navijam-default-profile.png';
