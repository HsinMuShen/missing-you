import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { jsonError } from '@/server/services/api-error';
import { getJournalChainVerification } from '@/server/services/blockchain-proof.service';
import * as journalService from '@/server/services/journal.service';
import { verifyJournalDto } from '@/server/services/verification.service';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const session = await auth();
    const userId = session?.user?.id;

    const journal = await journalService.getJournalById(id, userId);
    const localVerification = journal.anchor ? verifyJournalDto(journal) : null;
    const chainVerification = await getJournalChainVerification(journal);
    return NextResponse.json({ ...journal, localVerification, chainVerification });
  } catch (err) {
    return jsonError(err);
  }
}
