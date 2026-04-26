import { NextResponse } from 'next/server';
import { getMissingRequiredEnvForDeployment, isProduction } from '@/lib/config/env';

/** Lightweight BFF health check for deploy probes. */
export function GET() {
  const missing = getMissingRequiredEnvForDeployment();
  const ready = missing.length === 0;

  if (isProduction() && !ready) {
    return NextResponse.json(
      { ok: false, service: 'missing-you-web', reason: 'missing_env' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    service: 'missing-you-web',
    ready,
    ...(ready ? {} : { missingEnv: missing }),
  });
}
