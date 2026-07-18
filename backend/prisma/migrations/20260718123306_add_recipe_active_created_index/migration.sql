-- CreateIndex
CREATE INDEX "recipes_deleted_at_created_at_idx" ON "recipes"("deleted_at", "created_at");
