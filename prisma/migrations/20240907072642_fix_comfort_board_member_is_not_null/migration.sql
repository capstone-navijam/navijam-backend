/*
  Warnings:

  - Made the column `member_id` on table `comfort_board` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comfort_board" DROP CONSTRAINT "comfort_board_member_id_fkey";

-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW(),
ALTER COLUMN "member_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "comfort_board" ADD CONSTRAINT "comfort_board_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
