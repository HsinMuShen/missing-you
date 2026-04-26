import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = {
  journal: null as any,
};

vi.mock('@/server/repositories/journal.repository', () => ({
  createJournal: vi.fn(async (data: any) => {
    state.journal = {
      id: '1f83995b-86ec-467d-8f83-00ea6fffb157',
      userId: data.userId,
      content: data.content,
      person: data.person,
      privacy: data.privacy,
      status: 'draft',
      memoryId: null,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      anchor: null,
    };
    return state.journal;
  }),
  getJournalById: vi.fn(async () => state.journal),
  listJournals: vi.fn(async () => (state.journal ? [state.journal] : [])),
  updateJournal: vi.fn(async (_id: string, patch: any) => {
    state.journal = { ...state.journal, ...patch };
    return state.journal;
  }),
  setJournalMemoryId: vi.fn(async (_id: string, memoryId: string) => {
    state.journal = { ...state.journal, memoryId };
    return state.journal;
  }),
  markAsAnchored: vi.fn(async (params: any) => {
    state.journal = {
      ...state.journal,
      status: 'anchored',
      anchor: {
        id: 'anchor-1',
        journalId: params.journalId,
        memoryId: params.memoryId,
        contentHash: params.contentHash,
        txHash: params.txHash,
        chain: params.chain,
        chainId: params.chainId,
        contractAddress: params.contractAddress,
        anchoredAt: new Date('2026-01-02T00:00:00.000Z'),
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    };
    return { journal: state.journal, anchor: state.journal.anchor };
  }),
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

import { createJournal, markAnchored, prepareAnchor } from '@/server/services/journal.service';
import { verifyJournalDto } from '@/server/services/verification.service';

describe('integration: journal -> prepare -> confirm -> verify', () => {
  beforeEach(() => {
    state.journal = null;
  });

  it('runs an end-to-end logical flow', async () => {
    const created = await createJournal(
      {
        content: 'I still remember your handwriting.',
        person: 'Grandpa',
        privacy: 'share',
      },
      'user-1'
    );

    const prepared = await prepareAnchor(created.id, 'user-1');
    expect(prepared.contentHash).toMatch(/^0x[a-f0-9]{64}$/);

    const anchored = await markAnchored(created.id, 'user-1', {
      txHash: '0x' + 'f'.repeat(64),
      chainId: 80002,
      contractAddress: '0x1111111111111111111111111111111111111111',
    });

    expect(anchored.status).toBe('anchored');
    expect(anchored.anchor?.contentHash).toBe(prepared.contentHash);
    expect(verifyJournalDto(anchored)).toBe(true);
  });
});
