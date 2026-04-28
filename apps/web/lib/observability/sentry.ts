/**
 * Lightweight Sentry placeholder.
 *
 * Add `@sentry/nextjs` and wire this function when production monitoring is enabled.
 */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  if (process.env.SENTRY_DSN) {
    // eslint-disable-next-line no-console
    console.warn(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: 'warn',
        message: 'Sentry DSN configured but SDK not installed; capture skipped',
        context,
        error: error instanceof Error ? error.message : String(error),
      })
    );
  }
}
