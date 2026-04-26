import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import { getJournalChainVerification } from '@/server/services/blockchain-proof.service';
import * as journalService from '@/server/services/journal.service';
import { verifyJournalDto } from '@/server/services/verification.service';
import { journalIdParamSchema, updateShareabilitySchema } from '@/server/schemas/journal-api';
import { getRequestId } from '@/lib/observability/logger';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const parsedParams = journalIdParamSchema.safeParse(await ctx.params);
    if (!parsedParams.success) {
      return jsonApiError(
        400,
        { error: 'Invalid journal ID', code: 'VALIDATION_ERROR' },
        getRequestId(_req)
      );
    }
    const { id } = parsedParams.data;
    const session = await auth();
    const userId = session?.user?.id;

    const journal = await journalService.getJournalById(id, userId);
    const localVerification = journal.anchor ? verifyJournalDto(journal) : null;
    const chainVerification = await getJournalChainVerification(journal);
    return NextResponse.json({ ...journal, localVerification, chainVerification });
  } catch (err) {
    return jsonError(err, _req);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const parsedParams = journalIdParamSchema.safeParse(await ctx.params);
    if (!parsedParams.success) {
      return jsonApiError(
        400,
        { error: 'Invalid journal ID', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }
    const { id } = parsedParams.data;

    const parsedBody = updateShareabilitySchema.safeParse(await req.json());
    if (!parsedBody.success) {
      return jsonApiError(
        400,
        { error: 'Invalid shareability payload', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }

    const body = parsedBody.data;
    let chainMeta: { txHash: string; chainId: number; contractAddress: string } | undefined;
    if (body.txHash && body.chainId && body.contractAddress) {
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
    return jsonError(err, req);
  }
}
