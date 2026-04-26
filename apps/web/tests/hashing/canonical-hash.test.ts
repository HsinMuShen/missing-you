import { describe, expect, it } from 'vitest';
import { buildCanonicalPayload, serializeCanonicalPayload } from '@/lib/hashing/canonical';
import { generateHash } from '@/lib/hashing/hash';

describe('canonical payload + hashing', () => {
  const createdAt = new Date('2026-01-01T12:00:00.000Z');
  const memoryId = '4f1f4fb8-07c5-4a89-a047-0bb83d98507d';

  it('same input always yields same hash', () => {
    const payloadA = buildCanonicalPayload({
      content: 'I miss you every spring.',
      person: 'Mom',
      createdAt,
      memoryId,
    });
    const payloadB = buildCanonicalPayload({
      content: 'I miss you every spring.',
      person: 'Mom',
      createdAt,
      memoryId,
    });

    const hashA = generateHash(serializeCanonicalPayload(payloadA));
    const hashB = generateHash(serializeCanonicalPayload(payloadB));

    expect(hashA).toBe(hashB);
  });

  it('different content yields different hash', () => {
    const payloadA = buildCanonicalPayload({
      content: 'I miss you every spring.',
      person: 'Mom',
      createdAt,
      memoryId,
    });
    const payloadB = buildCanonicalPayload({
      content: 'I miss you every winter.',
      person: 'Mom',
      createdAt,
      memoryId,
    });

    const hashA = generateHash(serializeCanonicalPayload(payloadA));
    const hashB = generateHash(serializeCanonicalPayload(payloadB));

    expect(hashA).not.toBe(hashB);
  });

  it('input object field order does not affect canonical output', () => {
    const unordered = {
      memoryId,
      createdAt,
      person: 'Mom',
      content: 'A memory.',
    };

    const ordered = {
      content: 'A memory.',
      person: 'Mom',
      createdAt,
      memoryId,
    };

    const payloadA = buildCanonicalPayload(unordered);
    const payloadB = buildCanonicalPayload(ordered);

    expect(serializeCanonicalPayload(payloadA)).toBe(serializeCanonicalPayload(payloadB));
  });

  it('supports unicode and Traditional Chinese content', () => {
    const payload = buildCanonicalPayload({
      content: '想你了，今天也下雨。',
      person: '阿嬤',
      createdAt,
      memoryId,
    });

    const hash = generateHash(serializeCanonicalPayload(payload));
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('supports long content deterministically', () => {
    const longContent = 'memory '.repeat(5000);
    const payloadA = buildCanonicalPayload({
      content: longContent,
      person: null,
      createdAt,
      memoryId,
    });
    const payloadB = buildCanonicalPayload({
      content: longContent,
      person: null,
      createdAt,
      memoryId,
    });

    expect(generateHash(serializeCanonicalPayload(payloadA))).toBe(
      generateHash(serializeCanonicalPayload(payloadB))
    );
  });

  it('normalizes missing optional person to null', () => {
    const payload = buildCanonicalPayload({
      content: 'Memory',
      person: '   ',
      createdAt,
      memoryId,
    });

    expect(payload.person).toBeNull();
  });

  it('rejects empty content after trim', () => {
    expect(() =>
      buildCanonicalPayload({
        content: '   ',
        person: null,
        createdAt,
        memoryId,
      })
    ).toThrow();
  });
});
