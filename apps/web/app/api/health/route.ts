import { NextResponse } from 'next/server';

/** Lightweight BFF health check for deploy probes. */
export function GET() {
  return NextResponse.json({ ok: true, service: 'missing-you-web' });
}
