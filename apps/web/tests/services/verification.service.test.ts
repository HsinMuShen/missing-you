import { describe, expect, it } from 'vitest';
import { buildCanonicalPayload, generateHash, serializeCanonicalPayload } from '@/lib/hashing';
import { verifyMemory } from '@/server/services/verification.service';

describe('verifyMemory', () => {
  const baseJournal = {
    content: 'You taught me patience.',
    person: 'Dad',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    memoryId: '5ed374b4-bbdc-49d4-8efc-8c5082fa0b38',
  } as const;

  const validHash = generateHash(
    serializeCanonicalPayload(
      buildCanonicalPayload({
        ...baseJournal,
      })
    )
  );

  it('returns true when journal and hash match', () => {
    expect(verifyMemory({ ...baseJournal }, validHash)).toBe(true);
  });

  it('returns false when content is modified', () => {
    expect(
      verifyMemory(
        {
          ...baseJournal,
          content: 'You taught me courage.',
        },
        validHash
      )
    ).toBe(false);
  });

  it('returns false when person is modified', () => {
    expect(
      verifyMemory(
        {
          ...baseJournal,
          person: 'Mom',
        },
        validHash
      )
    ).toBe(false);
  });

  it('returns false when memoryId is missing', () => {
    expect(
      verifyMemory(
        {
          ...baseJournal,
          memoryId: null,
        },
        validHash
      )
    ).toBe(false);
  });

  it('returns false for corrupted hash', () => {
    expect(verifyMemory({ ...baseJournal }, '0xdeadbeef')).toBe(false);
  });
});
