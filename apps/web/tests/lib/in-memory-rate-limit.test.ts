import { describe, expect, it } from 'vitest';
import { takeRateLimit } from '@/lib/rate-limit/in-memory';

describe('takeRateLimit', () => {
  it('allows requests under the cap', () => {
    const key = `test:${Math.random()}`;
    expect(takeRateLimit(key, 3, 60_000)).toEqual({ ok: true });
    expect(takeRateLimit(key, 3, 60_000)).toEqual({ ok: true });
    expect(takeRateLimit(key, 3, 60_000)).toEqual({ ok: true });
  });

  it('rejects when cap exceeded until window passes', () => {
    const key = `test:${Math.random()}`;
    expect(takeRateLimit(key, 2, 60_000).ok).toBe(true);
    expect(takeRateLimit(key, 2, 60_000).ok).toBe(true);
    const third = takeRateLimit(key, 2, 60_000);
    expect(third.ok).toBe(false);
    if (!third.ok) {
      expect(third.retryAfterSec).toBeGreaterThan(0);
    }
  });
});
