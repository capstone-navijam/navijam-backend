-- AlterTable
ALTER TABLE "comfort_board" ADD COLUMN     "categories" "Category"[] DEFAULT ARRAY['자유']::"Category"[];
