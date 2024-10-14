-- AlterTable
ALTER TABLE "comfort_board" ALTER COLUMN "created_at" SET DEFAULT NOW();

-- AlterTable
ALTER TABLE "community_board" ADD COLUMN     "categories" "Category"[] DEFAULT ARRAY['자유']::"Category"[];
