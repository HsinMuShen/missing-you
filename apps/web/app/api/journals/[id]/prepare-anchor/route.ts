import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/route-guards';
import { enforceUserRateLimit } from '@/lib/rate-limit/enforce';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';
import { journalIdParamSchema } from '@/server/schemas/journal-api';
import { getRequestId } from '@/lib/observability/logger';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  try {
    const { userId, response } = await requireApiUser(_req);
    if (!userId) return response as NextResponse;

    const limited = enforceUserRateLimit(_req, userId, 'anchor_prepare');
    if (limited) return limited;

    const parsedParams = journalIdParamSchema.safeParse(await ctx.params);
    if (!parsedParams.success) {
      return jsonApiError(
        400,
        { error: 'Invalid journal ID', code: 'VALIDATION_ERROR' },
        getRequestId(_req)
      );
    }
    const { id } = parsedParams.data;
    const result = await journalService.prepareAnchor(id, userId);
    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err, _req);
  }
}
