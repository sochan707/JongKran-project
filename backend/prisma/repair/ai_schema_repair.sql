-- AlterTable
ALTER TABLE "ai_generated_recipes" ADD COLUMN     "ingredient_key" TEXT NOT NULL,
ALTER COLUMN "generated_by" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_ai_cooking" ALTER COLUMN "created_at" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ai_generated_recipes_ingredient_key_key" ON "ai_generated_recipes"("ingredient_key");

