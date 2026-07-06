-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "outputFormat" TEXT NOT NULL DEFAULT 'plaintext',
    "fee" REAL NOT NULL,
    "paymentToken" TEXT NOT NULL DEFAULT 'USDC',
    "builderWallet" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0.0',
    "runs" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "feePaid" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "txSignature" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Execution_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StakePosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "totalClaimed" REAL NOT NULL DEFAULT 0,
    "pendingRewards" REAL NOT NULL DEFAULT 0,
    "stakedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProtocolStats" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global',
    "totalStaked" REAL NOT NULL DEFAULT 0,
    "totalDistributed" REAL NOT NULL DEFAULT 0,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "uniqueStakers" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StakePosition_walletAddress_key" ON "StakePosition"("walletAddress");
