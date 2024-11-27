-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "reservation" (
    "id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "listener_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_listener_id_fkey" FOREIGN KEY ("listener_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
