import { NextResponse } from 'next/server';
import { JournalServiceError } from '@/server/services/journal.service';

export function jsonError(err: unknown) {
  if (err instanceof JournalServiceError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }

  if (err instanceof Error && err.message === 'UNAUTHORIZED') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.error(err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
