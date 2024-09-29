/*
  Warnings:

  - Added the required column `contact_number` to the `listener_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "listener_info" ADD COLUMN     "contact_number" VARCHAR(50) NOT NULL,
ADD COLUMN     "education" VARCHAR(50)[];
