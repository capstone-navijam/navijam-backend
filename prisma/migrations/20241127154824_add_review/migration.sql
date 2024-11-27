-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- CreateTable
CREATE TABLE "review" (
    "id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "listener_id" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "comment" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_listener_id_fkey" FOREIGN KEY ("listener_id") REFERENCES "listener_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
