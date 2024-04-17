-- CreateTable
CREATE TABLE "Member" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profile" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT,
    "career" TEXT,
    "description" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ROLE_MEMBER',

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsoleBoard" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "memberId" BIGINT,

    CONSTRAINT "ConsoleBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityBoard" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "memberId" BIGINT,

    CONSTRAINT "CommunityBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsoleComment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "post_id" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,

    CONSTRAINT "ConsoleComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityComment" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "post_id" BIGINT NOT NULL,
    "memberId" BIGINT NOT NULL,

    CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Likes" (
    "memberId" BIGINT NOT NULL,
    "postId" BIGINT NOT NULL,

    CONSTRAINT "Likes_pkey" PRIMARY KEY ("memberId","postId")
);

-- AddForeignKey
ALTER TABLE "ConsoleBoard" ADD CONSTRAINT "ConsoleBoard_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityBoard" ADD CONSTRAINT "CommunityBoard_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsoleComment" ADD CONSTRAINT "ConsoleComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "ConsoleBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsoleComment" ADD CONSTRAINT "ConsoleComment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "CommunityBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CommunityBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;