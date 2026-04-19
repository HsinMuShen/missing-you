import type { CanonicalMemoryPayload } from '@missing-you/shared';
import { canonicalPayloadSchema } from '@missing-you/shared';

/**
 * Canonical anchoring payload — deterministic JSON object.
 *
 * Rules:
 * - Fixed key order: `version`, `content`, `person`, `createdAt`, `memoryId` (object literal insertion order in JS).
 * - No `undefined` fields; use `null` for absent `person` so `JSON.stringify` is stable.
 * - Trim text fields so the same logical memory always hashes the same way.
 *
 * Any change to field names, order, or trimming rules requires a new `version` and coordinated contract upgrade.
 */
export function buildCanonicalPayload(journal: {
  content: string;
  person: string | null;
  createdAt: Date;
  memoryId: string;
}): CanonicalMemoryPayload {
  const person =
    journal.person === null || journal.person.trim() === '' ? null : journal.person.trim();

  const payload: CanonicalMemoryPayload = {
    version: 1,
    content: journal.content.trim(),
    person,
    createdAt: journal.createdAt.toISOString(),
    memoryId: journal.memoryId,
  };

  canonicalPayloadSchema.parse(payload);
  return payload;
}

/** Single-line JSON for hashing — no pretty-print, no trailing newline. */
export function serializeCanonicalPayload(payload: CanonicalMemoryPayload): string {
  return JSON.stringify(payload);
}
