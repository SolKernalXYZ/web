-- CreateIndex
CREATE INDEX IF NOT EXISTS "Skill_active_category_idx" ON "Skill"("active", "category");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Skill_provider_idx" ON "Skill"("provider");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Skill_createdAt_idx" ON "Skill"("createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Execution_skillId_createdAt_idx" ON "Execution"("skillId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Execution_walletAddress_idx" ON "Execution"("walletAddress");
