/*
  Warnings:

  - The `availableTime` column on the `listener_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" DROP COLUMN "availableTime",
ADD COLUMN     "availableTime" VARCHAR(200)[];
