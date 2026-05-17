import { logger } from '@/lib/observability/logger';

/**
 * Records a new account (email magic-link user created in Postgres).
 * Uses Vercel Web Analytics custom events — enable Analytics in the Vercel project.
 */
export async function trackSignup(): Promise<void> {
  if (process.env.NODE_ENV !== 'production') return;

  try {
    const { track } = await import('@vercel/analytics/server');
    await track('signup');
  } catch (err) {
    logger.warn('Analytics signup track failed', {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
