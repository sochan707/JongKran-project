DROP INDEX IF EXISTS "ai_generated_recipes_ingredient_key_key";

CREATE INDEX IF NOT EXISTS "idx_ai_generated_recipes_ingredient_key"
ON "ai_generated_recipes"("ingredient_key");
