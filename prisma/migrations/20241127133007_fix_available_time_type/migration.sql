/*
  Warnings:

  - You are about to alter the column `availableTime` on the `listener_info` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" ALTER COLUMN "availableTime" SET NOT NULL,
ALTER COLUMN "availableTime" SET DATA TYPE VARCHAR(200);
