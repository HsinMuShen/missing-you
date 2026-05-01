import { NextResponse } from 'next/server';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const pageSize = parsePositiveInt(searchParams.get('pageSize'), 12);
    const person = searchParams.get('person')?.trim() || undefined;

    const list = await journalService.listPublicJournals({ page, pageSize, person });
    return NextResponse.json(list);
  } catch (err) {
    return jsonError(err, req);
  }
}
