-- CreateEnum
CREATE TYPE "PriceChangeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "PendingPriceChange" (
    "id" BIGSERIAL NOT NULL,
    "listenerInfoId" BIGINT NOT NULL,
    "requestedPrice" INTEGER NOT NULL,
    "status" "PriceChangeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingPriceChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingPriceChange" ADD CONSTRAINT "PendingPriceChange_listenerInfoId_fkey" FOREIGN KEY ("listenerInfoId") REFERENCES "listener_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
