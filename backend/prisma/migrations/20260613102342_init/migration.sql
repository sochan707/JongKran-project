-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('create', 'update', 'delete', 'approve', 'reject');

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(20) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(25) NOT NULL,
    "user_profile" TEXT,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_auth" (
    "auth_id" SERIAL NOT NULL,
    "email" VARCHAR(40) NOT NULL,
    "password_hash" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("auth_id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "ingredient_id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "recipes" (
    "recipe_id" SERIAL NOT NULL,
    "title" VARCHAR(30) NOT NULL,
    "user_profile" TEXT,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "cook_time" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "recipe_ingredient_id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" VARCHAR(15) NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("recipe_ingredient_id")
);

-- CreateTable
CREATE TABLE "recipe_steps" (
    "step_id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "step_number" INTEGER NOT NULL,
    "instruction_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_steps_pkey" PRIMARY KEY ("step_id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "favorite_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("favorite_id")
);

-- CreateTable
CREATE TABLE "history" (
    "history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "cooked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "suggestion_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "suggestion_text" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("suggestion_id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "action_id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "recipe_id" INTEGER,
    "action_type" "AdminActionType" NOT NULL,
    "action_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_email_key" ON "user_auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_user_id_key" ON "user_auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_key" ON "ingredients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipe_id_ingredient_id_key" ON "recipe_ingredients"("recipe_id", "ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_steps_recipe_id_step_number_key" ON "recipe_steps"("recipe_id", "step_number");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_recipe_id_key" ON "favorites"("user_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth" ADD CONSTRAINT "user_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("ingredient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_steps" ADD CONSTRAINT "recipe_steps_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE SET NULL ON UPDATE CASCADE;
