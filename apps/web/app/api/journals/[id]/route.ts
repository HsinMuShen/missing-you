import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonError } from '@/server/services/api-error';
import { getJournalChainVerification } from '@/server/services/blockchain-proof.service';
import * as journalService from '@/server/services/journal.service';
import { verifyJournalDto } from '@/server/services/verification.service';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
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

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { userId, response } = await requireApiUser();
    if (!userId) return response as NextResponse;

    const { id } = await ctx.params;
    const body = (await req.json()) as {
      privacy?: 'private' | 'share';
      txHash?: string;
      chainId?: number;
      contractAddress?: string;
    };

    if (!body.privacy || (body.privacy !== 'private' && body.privacy !== 'share')) {
      return NextResponse.json({ error: 'Invalid privacy value' }, { status: 400 });
    }

    let chainMeta: { txHash: string; chainId: number; contractAddress: string } | undefined;
    if (
      typeof body.txHash === 'string' &&
      typeof body.chainId === 'number' &&
      typeof body.contractAddress === 'string'
    ) {
      chainMeta = {
        txHash: body.txHash,
        chainId: body.chainId,
        contractAddress: body.contractAddress,
      };
    }

    const journal = await journalService.updateShareability(id, userId, body.privacy, chainMeta);

    const localVerification = journal.anchor ? verifyJournalDto(journal) : null;
    const chainVerification = await getJournalChainVerification(journal);
    return NextResponse.json({ ...journal, localVerification, chainVerification });
  } catch (err) {
    return jsonError(err);
  }
}
