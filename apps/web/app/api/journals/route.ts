import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('userId');
    const userId = q && q.length > 0 ? q : undefined;
    const list = await journalService.listJournalsForUser(userId);
    return NextResponse.json(list);
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const journal = await journalService.createJournal(body);
    return NextResponse.json(journal, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
