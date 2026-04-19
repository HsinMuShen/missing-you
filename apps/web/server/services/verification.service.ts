import type { Journal } from '@missing-you/shared';
import { buildCanonicalPayload, generateHash, normalizeHashHex, serializeCanonicalPayload } from '@/lib/hashing';

/**
 * Recomputes the canonical JSON + SHA-256 digest and compares to the stored anchor hash.
 * Used for local verification before/without RPC calls.
 */
export function verifyMemory(
  journal: {
    content: string;
    person: string | null;
    createdAt: Date;
    memoryId: string | null;
  },
  storedHash: string
): boolean {
  if (!journal.memoryId) {
    return false;
  }

  const payload = buildCanonicalPayload({
    content: journal.content,
    person: journal.person,
    createdAt: journal.createdAt,
    memoryId: journal.memoryId,
  });
  const json = serializeCanonicalPayload(payload);
  const computed = generateHash(json);
  return normalizeHashHex(computed) === normalizeHashHex(storedHash);
}

/** API-layer helper: uses DTO fields + `anchor.contentHash` from GET /api/journals/:id */
export function verifyJournalDto(journal: Journal): boolean {
  if (!journal.memoryId || !journal.anchor?.contentHash) {
    return false;
  }
  return verifyMemory(
    {
      content: journal.content,
      person: journal.person,
      createdAt: new Date(journal.createdAt),
      memoryId: journal.memoryId,
    },
    journal.anchor.contentHash
  );
}
