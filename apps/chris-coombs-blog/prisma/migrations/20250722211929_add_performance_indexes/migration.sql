-- CreateIndex
CREATE INDEX "pages_published_idx" ON "pages"("published");

-- CreateIndex
CREATE INDEX "posts_published_publishedAt_idx" ON "posts"("published", "publishedAt" DESC);

-- CreateIndex
CREATE INDEX "posts_published_featured_idx" ON "posts"("published", "featured");

-- CreateIndex
CREATE INDEX "posts_published_tags_idx" ON "posts"("published", "tags");
