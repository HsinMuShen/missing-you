/**
 * Fixed-window rate limiting per key (in-process). Suitable for single-node or low-scale deploys.
 * For multi-instance production, prefer a shared store (Redis/Upstash) — see docs/security-and-hardening.md.
 */

export type RateLimitTakeResult = { ok: true } | { ok: false; retryAfterSec: number };

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function takeRateLimit(key: string, max: number, windowMs: number): RateLimitTakeResult {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now - b.windowStart >= windowMs) {
    b = { count: 1, windowStart: now };
    buckets.set(key, b);
    return { ok: true };
  }
  if (b.count >= max) {
    const retryAfterMs = windowMs - (now - b.windowStart);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }
  b.count += 1;
  return { ok: true };
}
