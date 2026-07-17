-- CreateEnum
CREATE TYPE "ai_action" AS ENUM ('cook', 'skip');

-- DropForeignKey
ALTER TABLE "logs_audit" DROP CONSTRAINT "logs_audit_admin_id_fkey";

-- AlterTable
ALTER TABLE "ingredients" ADD COLUMN     "calories_per_100g" INTEGER,
ADD COLUMN     "carbs_per_100g" DOUBLE PRECISION,
ADD COLUMN     "fat_per_100g" DOUBLE PRECISION,
ADD COLUMN     "protein_per_100g" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "logs_audit" DROP CONSTRAINT "logs_audit_pkey",
DROP COLUMN "admin_id",
DROP COLUMN "log_id",
ADD COLUMN     "audit_id" SERIAL NOT NULL,
ADD COLUMN     "suggestion_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "logs_audit_pkey" PRIMARY KEY ("audit_id");

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "prep_time" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "servings" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "cook_time" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "suggestions" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" VARCHAR(100),
ADD COLUMN     "dob" DATE,
ADD COLUMN     "gender" VARCHAR(10),
ADD COLUMN     "status" VARCHAR(10) DEFAULT 'active';

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "token_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "ai_generated_recipes" (
    "ai_recipe_id" SERIAL NOT NULL,
    "ingredient_key" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "ingredients" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "generated_by" VARCHAR(50) NOT NULL DEFAULT 'OpenAI',
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "approved_recipe_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generated_recipes_pkey" PRIMARY KEY ("ai_recipe_id")
);

-- CreateTable
CREATE TABLE "user_ai_cooking" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ai_recipe_id" INTEGER NOT NULL,
    "ingredient_key" TEXT NOT NULL,
    "action" "ai_action" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_ai_cooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ai_generated_recipes_ingredient_key_key" ON "ai_generated_recipes"("ingredient_key");

-- CreateIndex
CREATE INDEX "idx_user_ai_cooking_ingredient_key" ON "user_ai_cooking"("ingredient_key");

-- CreateIndex
CREATE INDEX "idx_user_ai_cooking_user_ingredient" ON "user_ai_cooking"("user_id", "ingredient_key");

-- CreateIndex
CREATE INDEX "logs_audit_suggestion_id_idx" ON "logs_audit"("suggestion_id");

-- AddForeignKey
ALTER TABLE "logs_audit" ADD CONSTRAINT "logs_audit_admin_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_audit" ADD CONSTRAINT "logs_audit_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "suggestions"("suggestion_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_generated_recipes" ADD CONSTRAINT "fk_approved_recipe" FOREIGN KEY ("approved_recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_ai_cooking" ADD CONSTRAINT "fk_ai_recipe" FOREIGN KEY ("ai_recipe_id") REFERENCES "ai_generated_recipes"("ai_recipe_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_ai_cooking" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

