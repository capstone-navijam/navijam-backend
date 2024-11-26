/*
  Warnings:

  - You are about to drop the `PendingPriceChange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingPriceChange" DROP CONSTRAINT "PendingPriceChange_listenerInfoId_fkey";

-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" ADD COLUMN     "lastPriceChange" TIMESTAMP(3),
ADD COLUMN     "priceChangeCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "PendingPriceChange";

-- DropEnum
DROP TYPE "PriceChangeStatus";
