-- CreateTable
CREATE TABLE "WalletLinkChallenge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletLinkChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletLinkChallenge_userId_key" ON "WalletLinkChallenge"("userId");

-- CreateIndex
CREATE INDEX "WalletLinkChallenge_userId_address_idx" ON "WalletLinkChallenge"("userId", "address");

-- AddForeignKey
ALTER TABLE "WalletLinkChallenge" ADD CONSTRAINT "WalletLinkChallenge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
