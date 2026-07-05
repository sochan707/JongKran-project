/*
  Warnings:

  - The primary key for the `recipe_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipe_ingredient_id` on the `recipe_ingredients` table. All the data in the column will be lost.
  - You are about to drop the column `user_profile` on the `recipes` table. All the data in the column will be lost.
  - The primary key for the `user_auth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `auth_id` on the `user_auth` table. All the data in the column will be lost.
  - You are about to drop the `admin_actions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin_actions" DROP CONSTRAINT "admin_actions_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "admin_actions" DROP CONSTRAINT "admin_actions_recipe_id_fkey";

-- DropIndex
DROP INDEX "user_auth_user_id_key";

-- AlterTable
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_pkey",
DROP COLUMN "recipe_ingredient_id";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "user_profile";

-- AlterTable
ALTER TABLE "user_auth" DROP CONSTRAINT "user_auth_pkey",
DROP COLUMN "auth_id",
ADD CONSTRAINT "user_auth_pkey" PRIMARY KEY ("user_id");

-- DropTable
DROP TABLE "admin_actions";

-- CreateTable
CREATE TABLE "logs_audit" (
    "log_id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "recipe_id" INTEGER,
    "action_type" "AdminActionType" NOT NULL,
    "action_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_audit_pkey" PRIMARY KEY ("log_id")
);

-- AddForeignKey
ALTER TABLE "logs_audit" ADD CONSTRAINT "logs_audit_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_audit" ADD CONSTRAINT "logs_audit_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("recipe_id") ON DELETE SET NULL ON UPDATE CASCADE;
