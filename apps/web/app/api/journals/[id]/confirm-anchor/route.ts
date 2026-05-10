import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/route-guards';

/** Lets `waitForTransactionReceipt` run long enough on slow testnet RPCs (override via host limits / plan). */
export const maxDuration = 180;
import { enforceUserRateLimit } from '@/lib/rate-limit/enforce';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';
import { confirmAnchorBodySchema, journalIdParamSchema } from '@/server/schemas/journal-api';
import { getRequestId } from '@/lib/observability/logger';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const limited = enforceUserRateLimit(req, userId, 'anchor_confirm');
    if (limited) return limited;

    const parsedParams = journalIdParamSchema.safeParse(await ctx.params);
    if (!parsedParams.success) {
      return jsonApiError(
        400,
        { error: 'Invalid journal ID', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }
    const { id } = parsedParams.data;
    const json: unknown = await req.json();
    const parsed = confirmAnchorBodySchema.safeParse(json);
    if (!parsed.success) {
      return jsonApiError(
        400,
        { error: 'Invalid confirm-anchor payload', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }
    const journal = await journalService.markAnchored(id, userId, parsed.data);
    return NextResponse.json(journal);
  } catch (err) {
    return jsonError(err, req);
  }
}
