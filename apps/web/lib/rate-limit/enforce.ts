import { NextResponse } from 'next/server';
import { getRequestId, logger } from '@/lib/observability/logger';
import { takeRateLimit } from '@/lib/rate-limit/in-memory';

export type ApiRateLimitKind = 'journal_create' | 'anchor_prepare' | 'anchor_confirm' | 'wallet_link';

const LIMITS: Record<ApiRateLimitKind, { max: number; windowMs: number }> = {
  journal_create: { max: 60, windowMs: 60 * 60 * 1000 },
  anchor_prepare: { max: 40, windowMs: 60 * 60 * 1000 },
  anchor_confirm: { max: 80, windowMs: 60 * 60 * 1000 },
  wallet_link: { max: 40, windowMs: 60 * 60 * 1000 },
};

/**
 * Returns a 429 JSON response when limited, otherwise null.
 */
export function enforceUserRateLimit(
  req: Request,
  userId: string,
  kind: ApiRateLimitKind
): NextResponse | null {
  const { max, windowMs } = LIMITS[kind];
  const key = `${kind}:${userId}`;
  const result = takeRateLimit(key, max, windowMs);
  if (result.ok) return null;

  logger.warn('api_rate_limited', {
    kind,
    userId,
    retryAfterSec: result.retryAfterSec,
    requestId: getRequestId(req),
  });

  return NextResponse.json(
    { error: 'Too many requests. Please try again later.', code: 'RATE_LIMIT' },
    {
      status: 429,
      headers: { 'Retry-After': String(result.retryAfterSec) },
    }
  );
}
