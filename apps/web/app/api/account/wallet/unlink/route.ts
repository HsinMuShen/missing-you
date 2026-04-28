import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonError } from '@/server/services/api-error';
import { prisma } from '@/lib/db/client';

export async function POST(req: Request) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { walletAddress: null } });
      await tx.walletLinkChallenge.deleteMany({ where: { userId } });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonError(err, req);
  }
}
