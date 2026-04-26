import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  try {
    const { userId, response } = await requireApiUser();
    if (!userId) return response as NextResponse;

    const { id } = await ctx.params;
    const result = await journalService.prepareAnchor(id, userId);
    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
