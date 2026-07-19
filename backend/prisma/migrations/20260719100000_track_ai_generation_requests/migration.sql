CREATE TABLE "ai_generation_requests" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER NOT NULL,
  "ingredient_key" TEXT NOT NULL,
  "recipe_ids" INTEGER[] NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_generation_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "idx_ai_generation_request_window"
ON "ai_generation_requests"("user_id", "ingredient_key", "created_at");

ALTER TABLE "ai_generation_requests"
ADD CONSTRAINT "fk_ai_generation_request_user"
FOREIGN KEY ("user_id") REFERENCES "users"("user_id")
ON DELETE CASCADE ON UPDATE NO ACTION;
