-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'LISTENER');

-- CreateTable
CREATE TABLE "member" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "profile" VARCHAR(100) NOT NULL,
    "address" VARCHAR(50),
    "name" VARCHAR(10),
    "career" VARCHAR(50),
    "description" VARCHAR(100),
    "role" "Role" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "console_board" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" BIGINT,

    CONSTRAINT "console_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_board" (
    "id" BIGSERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" BIGINT,

    CONSTRAINT "community_board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "console_comment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "post_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,

    CONSTRAINT "console_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_comment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "post_id" BIGINT NOT NULL,
    "member_id" BIGINT NOT NULL,

    CONSTRAINT "community_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "member_id" BIGINT NOT NULL,
    "post_id" BIGINT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("member_id","post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_email_key" ON "member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "member_nickname_key" ON "member"("nickname");

-- AddForeignKey
ALTER TABLE "console_board" ADD CONSTRAINT "console_board_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_board" ADD CONSTRAINT "community_board_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_comment" ADD CONSTRAINT "console_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "console_board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "console_comment" ADD CONSTRAINT "console_comment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comment" ADD CONSTRAINT "community_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comment" ADD CONSTRAINT "community_comment_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
