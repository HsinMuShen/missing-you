import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { jsonError } from '@/server/services/api-error';
import * as journalService from '@/server/services/journal.service';

const bodySchema = z.object({
  txHash: z.string().min(1).max(200),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const json: unknown = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const journal = await journalService.markAnchored(id, parsed.data.txHash);
    return NextResponse.json(journal);
  } catch (err) {
    return jsonError(err);
  }
}
