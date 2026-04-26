import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/repositories/journal.repository', () => ({
  createJournal: vi.fn(),
  getJournalById: vi.fn(),
  listJournals: vi.fn(),
  updateJournal: vi.fn(),
  setJournalMemoryId: vi.fn(),
  markAsAnchored: vi.fn(),
}));

vi.mock('@/lib/blockchain/validate-anchor-tx', () => ({
  assertAnchorTransactionSucceeded: vi.fn().mockResolvedValue(undefined),
  AnchorTxValidationError: class AnchorTxValidationError extends Error {
    constructor(
      message: string,
      public readonly httpStatus: number
    ) {
      super(message);
    }
  },
}));

import * as repo from '@/server/repositories/journal.repository';
import {
  JournalServiceError,
  createJournal,
  markAnchored,
  prepareAnchor,
} from '@/server/services/journal.service';

const mockedRepo = vi.mocked(repo);

function makeRow(overrides: Partial<any> = {}) {
  return {
    id: '6d0f1961-cce8-44da-8a26-bca4b7f7f0b9',
    userId: 'user-1',
    content: 'A gentle memory',
    person: 'Grandma',
    privacy: 'private',
    status: 'draft',
    memoryId: '6d0f1961-cce8-44da-8a26-bca4b7f7f0b9',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    anchor: null,
    ...overrides,
  };
}

describe('journal.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createJournal writes draft and returns DTO', async () => {
    const created = makeRow();
    mockedRepo.createJournal.mockResolvedValue(created);
    mockedRepo.getJournalById.mockResolvedValue(created);

    const result = await createJournal(
      {
        content: '  hello  ',
        person: '  mom ',
        privacy: 'private',
      },
      'user-1'
    );

    expect(mockedRepo.createJournal).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        content: 'hello',
        person: 'mom',
        privacy: 'private',
      })
    );
    expect(result.status).toBe('draft');
    expect(result.id).toBe(created.id);
  });

  it('prepareAnchor returns canonical payload and deterministic hash', async () => {
    const row = makeRow({ privacy: 'share' });
    mockedRepo.getJournalById.mockResolvedValue(row);

    const result = await prepareAnchor(row.id, 'user-1');

    expect(result.memoryId).toBe(row.memoryId);
    expect(result.contentHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(result.shareable).toBe(true);
    expect(result.payload.memoryId).toBe(row.memoryId);
    expect(result.memoryIdBytes32).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('markAnchored transitions status and writes anchor metadata', async () => {
    const row = makeRow({
      status: 'draft',
      anchor: null,
      memoryId: '6d0f1961-cce8-44da-8a26-bca4b7f7f0b9',
    });
    const anchoredRow = makeRow({
      status: 'anchored',
      anchor: {
        id: 'anchor-1',
        journalId: row.id,
        memoryId: row.memoryId,
        contentHash: '0x' + 'a'.repeat(64),
        txHash: '0x' + 'b'.repeat(64),
        chain: 'polygon-amoy',
        chainId: 80002,
        contractAddress: '0x1111111111111111111111111111111111111111',
        anchoredAt: new Date('2026-01-02T00:00:00.000Z'),
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    });

    mockedRepo.getJournalById
      .mockResolvedValueOnce(row)
      .mockResolvedValueOnce(anchoredRow);
    mockedRepo.markAsAnchored.mockResolvedValue({
      journal: anchoredRow,
      anchor: anchoredRow.anchor,
    } as any);

    const result = await markAnchored(row.id, 'user-1', {
      txHash: '0x' + 'c'.repeat(64),
      chainId: 80002,
      contractAddress: '0x1111111111111111111111111111111111111111',
    });

    expect(mockedRepo.markAsAnchored).toHaveBeenCalledOnce();
    expect(result.status).toBe('anchored');
    expect(result.anchor?.txHash).toBe('0x' + 'b'.repeat(64));
  });

  it('throws when non-owner prepares anchor', async () => {
    mockedRepo.getJournalById.mockResolvedValue(makeRow({ userId: 'user-2' }));

    await expect(prepareAnchor('6d0f1961-cce8-44da-8a26-bca4b7f7f0b9', 'user-1')).rejects.toMatchObject(
      {
        status: 404,
        code: 'NOT_FOUND',
      }
    );
  });

  it('throws validation error for invalid create payload', async () => {
    await expect(createJournal({ content: '', privacy: 'private' }, 'user-1')).rejects.toBeInstanceOf(
      JournalServiceError
    );
  });
});
