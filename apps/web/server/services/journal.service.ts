import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';
import type { Journal, JournalPrivacy, JournalStatus, MemoryProof } from '@missing-you/shared';
import { journalCreateSchema } from '@missing-you/shared';
import { ensureUserId, getDefaultUserId } from '@/lib/db/default-user';
import {
  buildCanonicalPayload,
  generateHash,
  serializeCanonicalPayload,
} from '@/lib/hashing';
import * as journalRepo from '@/server/repositories/journal.repository';
import type { JournalWithAnchor } from '@/server/repositories/journal.repository';

export class JournalServiceError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'INVALID_STATE' | 'VALIDATION' | 'CONFLICT',
    public readonly status = 400
  ) {
    super(message);
    this.name = 'JournalServiceError';
  }
}

function assertPrivacy(v: string): JournalPrivacy {
  if (v !== 'private' && v !== 'share') {
    throw new JournalServiceError('Invalid privacy value', 'VALIDATION', 400);
  }
  return v;
}

function assertStatus(v: string): JournalStatus {
  if (v !== 'draft' && v !== 'anchored') {
    throw new JournalServiceError('Invalid status value', 'VALIDATION', 400);
  }
  return v;
}

function toProofDto(row: NonNullable<JournalWithAnchor['anchor']>): MemoryProof {
  return {
    id: row.id,
    journalId: row.journalId,
    memoryId: row.memoryId,
    contentHash: row.contentHash,
    txHash: row.txHash,
    chain: row.chain,
    anchoredAt: row.anchoredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toJournalDto(row: JournalWithAnchor): Journal {
  return {
    id: row.id,
    userId: row.userId,
    content: row.content,
    person: row.person,
    privacy: assertPrivacy(row.privacy),
    status: assertStatus(row.status),
    memoryId: row.memoryId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    anchor: row.anchor ? toProofDto(row.anchor) : null,
  };
}

function anchorChain(): string {
  return process.env.ANCHOR_CHAIN?.trim() || 'local-dev';
}

export async function createJournal(input: unknown): Promise<Journal> {
  const parsed = journalCreateSchema.safeParse(input);
  if (!parsed.success) {
    throw new JournalServiceError(parsed.error.message, 'VALIDATION', 400);
  }

  const userId = parsed.data.userId ?? (await getDefaultUserId());
  if (parsed.data.userId) {
    await ensureUserId(parsed.data.userId);
  }
  const person =
    parsed.data.person === undefined || parsed.data.person === null || parsed.data.person === ''
      ? null
      : parsed.data.person.trim() || null;

  const row = await journalRepo.createJournal({
    userId,
    content: parsed.data.content.trim(),
    person,
    privacy: parsed.data.privacy,
  });

  const full = await journalRepo.getJournalById(row.id);
  if (!full) {
    throw new JournalServiceError('Journal missing after create', 'NOT_FOUND', 500);
  }
  return toJournalDto(full);
}

export async function getJournalById(id: string): Promise<Journal> {
  const row = await journalRepo.getJournalById(id);
  if (!row) {
    throw new JournalServiceError('Journal not found', 'NOT_FOUND', 404);
  }
  return toJournalDto(row);
}

export async function listJournalsForUser(userId?: string): Promise<Journal[]> {
  const uid = userId ?? (await getDefaultUserId());
  const rows = await journalRepo.listJournals(uid);
  return rows.map(toJournalDto);
}

export async function updateJournal(
  id: string,
  patch: { content?: string; person?: string | null; privacy?: JournalPrivacy }
): Promise<Journal> {
  const existing = await journalRepo.getJournalById(id);
  if (!existing) {
    throw new JournalServiceError('Journal not found', 'NOT_FOUND', 404);
  }
  if (existing.status !== 'draft') {
    throw new JournalServiceError('Only drafts can be edited', 'INVALID_STATE', 409);
  }

  const data: Prisma.JournalUpdateInput = {};
  if (patch.content !== undefined) data.content = patch.content.trim();
  if (patch.person !== undefined) {
    data.person =
      patch.person === null || patch.person.trim() === '' ? null : patch.person.trim();
  }
  if (patch.privacy !== undefined) data.privacy = patch.privacy;

  await journalRepo.updateJournal(id, data);
  const row = await journalRepo.getJournalById(id);
  if (!row) {
    throw new JournalServiceError('Journal not found', 'NOT_FOUND', 404);
  }
  return toJournalDto(row);
}

export type PrepareAnchorResult = {
  memoryId: string;
  contentHash: string;
  payload: ReturnType<typeof buildCanonicalPayload>;
  canonicalJson: string;
};

export async function prepareAnchor(journalId: string): Promise<PrepareAnchorResult> {
  const row = await journalRepo.getJournalById(journalId);
  if (!row) {
    throw new JournalServiceError('Journal not found', 'NOT_FOUND', 404);
  }
  if (row.status !== 'draft') {
    throw new JournalServiceError('Journal is not a draft', 'INVALID_STATE', 409);
  }
  if (row.anchor) {
    throw new JournalServiceError('Journal already anchored', 'CONFLICT', 409);
  }

  const memoryId = randomUUID();
  await journalRepo.setJournalMemoryId(journalId, memoryId);

  const refreshed = await journalRepo.getJournalById(journalId);
  if (!refreshed?.memoryId) {
    throw new JournalServiceError('Failed to persist memoryId', 'INVALID_STATE', 500);
  }

  const payload = buildCanonicalPayload({
    content: refreshed.content,
    person: refreshed.person,
    createdAt: refreshed.createdAt,
    memoryId: refreshed.memoryId,
  });
  const canonicalJson = serializeCanonicalPayload(payload);
  const contentHash = generateHash(canonicalJson);

  return { memoryId, contentHash, payload, canonicalJson };
}

export async function markAnchored(journalId: string, txHash: string): Promise<Journal> {
  const row = await journalRepo.getJournalById(journalId);
  if (!row) {
    throw new JournalServiceError('Journal not found', 'NOT_FOUND', 404);
  }
  if (row.status === 'anchored' || row.anchor) {
    throw new JournalServiceError('Journal already anchored', 'CONFLICT', 409);
  }
  if (!row.memoryId) {
    throw new JournalServiceError('Call prepare-anchor first', 'INVALID_STATE', 400);
  }

  const payload = buildCanonicalPayload({
    content: row.content,
    person: row.person,
    createdAt: row.createdAt,
    memoryId: row.memoryId,
  });
  const canonicalJson = serializeCanonicalPayload(payload);
  const contentHash = generateHash(canonicalJson);

  await journalRepo.markAsAnchored({
    journalId,
    memoryId: row.memoryId,
    contentHash,
    txHash: txHash.trim(),
    chain: anchorChain(),
  });

  const full = await journalRepo.getJournalById(journalId);
  if (!full) {
    throw new JournalServiceError('Journal missing after anchor', 'NOT_FOUND', 500);
  }
  return toJournalDto(full);
}
