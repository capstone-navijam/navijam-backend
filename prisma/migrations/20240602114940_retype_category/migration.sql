/*
  Warnings:

  - You are about to drop the column `create_at` on the `console_board` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `career` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `member` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listener_info_id]` on the table `member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `console_board` table without a default value. This is not possible if the table is not empty.
  - Made the column `profile` on table `member` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('자유', '육아', '진로', '결혼', '외모', '인간관계', '중독', '이별', '가족', '친구', '건강', '정신건강');

-- AlterTable
ALTER TABLE "console_board" DROP COLUMN "create_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "member" DROP COLUMN "address",
DROP COLUMN "career",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "phone_number",
ADD COLUMN     "listener_info_id" BIGINT,
ALTER COLUMN "profile" SET NOT NULL,
ALTER COLUMN "profile" SET DEFAULT 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1716450266/noticon/d8lxdvnbkge2boslxgqj.gif';

-- CreateTable
CREATE TABLE "listener_info" (
    "id" BIGSERIAL NOT NULL,
    "phone_number" VARCHAR(20),
    "address" VARCHAR(50),
    "career" VARCHAR(50)[],
    "description" VARCHAR(100) NOT NULL,
    "category" "Category"[],

    CONSTRAINT "listener_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_listener_info_id_key" ON "member"("listener_info_id");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_listener_info_id_fkey" FOREIGN KEY ("listener_info_id") REFERENCES "listener_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
