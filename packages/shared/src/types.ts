/**
 * Supported UI / content locales. Kept in sync with next-intl routing.
 */
export type Locale = 'en' | 'zh-TW';

/** Journal visibility for MVP (matches Prisma `Journal.privacy`). */
export type JournalPrivacy = 'private' | 'share';

/** Journal lifecycle (matches Prisma `Journal.status`). */
export type JournalStatus = 'draft' | 'anchored';

/**
 * API / client journal shape. Full `content` is never written on-chain.
 */
export interface Journal {
  id: string;
  userId: string;
  content: string;
  person: string | null;
  privacy: JournalPrivacy;
  status: JournalStatus;
  memoryId: string | null;
  createdAt: string;
  updatedAt: string;
  /** Present when `confirm-anchor` has been called (tx recorded, not yet on-chain in this MVP). */
  anchor?: MemoryProof | null;
}

/**
 * Deterministic object hashed with SHA-256 before anchoring.
 * Field order is fixed in `apps/web/lib/hashing/canonical.ts` when serializing to JSON.
 */
export interface CanonicalMemoryPayload {
  version: 1;
  content: string;
  person: string | null;
  createdAt: string;
  memoryId: string;
}

/**
 * Persisted anchor row (off-chain mirror of what will be verified on-chain later).
 */
export interface MemoryProof {
  id: string;
  journalId: string;
  memoryId: string;
  contentHash: string;
  txHash: string | null;
  chain: string;
  chainId: number | null;
  contractAddress: string | null;
  anchoredAt: string | null;
  createdAt: string;
}
