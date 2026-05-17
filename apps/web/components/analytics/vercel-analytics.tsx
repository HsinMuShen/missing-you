'use client';

import { Analytics } from '@vercel/analytics/react';

/** Vercel Web Analytics — page views; enable in Vercel project → Analytics. */
export function VercelAnalytics() {
  return <Analytics />;
}
