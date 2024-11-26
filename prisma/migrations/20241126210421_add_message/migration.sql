/*
  Warnings:

  - You are about to drop the column `lastPriceChange` on the `listener_info` table. All the data in the column will be lost.
  - You are about to drop the column `priceChangeCount` on the `listener_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_room" ADD COLUMN     "recentMessage" TEXT,
ADD COLUMN     "recent_message_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" DROP COLUMN "lastPriceChange",
DROP COLUMN "priceChangeCount";
