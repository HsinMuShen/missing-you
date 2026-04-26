import { NextResponse } from 'next/server';
import { getMissingRequiredEnvForDeployment, isProduction } from '@/lib/config/env';

/** Readiness probe for deploy platforms and smoke tests. */
export function GET() {
  const missing = getMissingRequiredEnvForDeployment();
  const ready = missing.length === 0;

  if (!ready && isProduction()) {
    return NextResponse.json({ ok: false, ready, missingEnv: missing }, { status: 503 });
  }

  return NextResponse.json({ ok: true, ready, ...(ready ? {} : { missingEnv: missing }) });
}
