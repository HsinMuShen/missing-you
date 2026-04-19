import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';
import { verifyJournalDto } from '@/server/services/verification.service';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const journal = await journalService.getJournalById(id);
    const localVerification = journal.anchor ? verifyJournalDto(journal) : null;
    return NextResponse.json({ ...journal, localVerification });
  } catch (err) {
    return jsonError(err);
  }
}
