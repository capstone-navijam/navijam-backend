/*
  Warnings:

  - You are about to drop the column `updated_at` on the `console_comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "console_comment" DROP COLUMN "updated_at";
