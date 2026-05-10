import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/route-guards';
import { enforceUserRateLimit } from '@/lib/rate-limit/enforce';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

export async function GET() {
  try {
    const { userId, response } = await requireApiUser();
    if (!userId) return response as NextResponse;

    const list = await journalService.listJournalsForUser(userId);
    return NextResponse.json(list);
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(req: Request) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const limited = enforceUserRateLimit(req, userId, 'journal_create');
    if (limited) return limited;

    const body: unknown = await req.json();
    const journal = await journalService.createJournal(body, userId);
    return NextResponse.json(journal, { status: 201 });
  } catch (err) {
    return jsonError(err, req);
  }
}
