/*
  Warnings:

  - You are about to drop the column `post_id` on the `console_comment` table. All the data in the column will be lost.
  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `post_id` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `listener_info` table. All the data in the column will be lost.
  - You are about to drop the `console_board` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `community_comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `console_id` to the `console_comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `console_comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `community_id` to the `likes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "console_board" DROP CONSTRAINT "console_board_member_id_fkey";

-- DropForeignKey
ALTER TABLE "console_comment" DROP CONSTRAINT "console_comment_member_id_fkey";

-- DropForeignKey
ALTER TABLE "console_comment" DROP CONSTRAINT "console_comment_post_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_fkey";

-- AlterTable
ALTER TABLE "community_comment" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "console_comment" DROP COLUMN "post_id",
ADD COLUMN     "console_id" BIGINT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "member_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "likes" DROP CONSTRAINT "likes_pkey",
DROP COLUMN "post_id",
ADD COLUMN     "community_id" BIGINT NOT NULL,
ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("member_id", "community_id");

-- AlterTable
ALTER TABLE "listener_info" DROP COLUMN "category",
ADD COLUMN     "categories" "Category"[] DEFAULT ARRAY[]::"Category"[],
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "console_board";

-- CreateTable
CREATE TABLE "comfort_board" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" BIGINT,

    CONSTRAINT "comfort_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "console" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "comfort_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,

    CONSTRAINT "console_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comfort_board" ADD CONSTRAINT "comfort_board_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console" ADD CONSTRAINT "console_comfort_id_fkey" FOREIGN KEY ("comfort_id") REFERENCES "comfort_board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console" ADD CONSTRAINT "console_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_comment" ADD CONSTRAINT "console_comment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_comment" ADD CONSTRAINT "console_comment_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "console"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "community_board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
