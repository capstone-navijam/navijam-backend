/*
  Warnings:

  - A unique constraint covering the columns `[member_id,listener_id]` on the table `chat_room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- CreateIndex
CREATE UNIQUE INDEX "chat_room_member_id_listener_id_key" ON "chat_room"("member_id", "listener_id");
