import { NextRequest, NextResponse } from 'next/server';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const result = await journalService.prepareAnchor(id);
    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
