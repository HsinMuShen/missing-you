import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyMessage } from 'viem';
import { Prisma } from '@prisma/client';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import { getRequestId } from '@/lib/observability/logger';
import { prisma } from '@/lib/db/client';
import { buildWalletLinkMessage } from '@/lib/wallet-link/message';

const bodySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/),
});

export async function POST(req: Request) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonApiError(
        400,
        { error: 'Invalid wallet confirmation payload', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }

    const address = parsed.data.address.toLowerCase();
    const challenge = await prisma.walletLinkChallenge.findUnique({ where: { userId } });
    if (!challenge || challenge.address.toLowerCase() !== address) {
      return jsonApiError(
        400,
        { error: 'No active wallet-link challenge for this address', code: 'WALLET_LINK_NO_CHALLENGE' },
        getRequestId(req)
      );
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      return jsonApiError(
        400,
        { error: 'Wallet-link challenge expired. Please try again.', code: 'WALLET_LINK_EXPIRED' },
        getRequestId(req)
      );
    }

    const message = buildWalletLinkMessage({
      address,
      nonce: challenge.nonce,
      userId,
      issuedAt: challenge.updatedAt.toISOString(),
    });

    const ok = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: parsed.data.signature as `0x${string}`,
    });

    if (!ok) {
      return jsonApiError(
        400,
        { error: 'Signature verification failed', code: 'WALLET_LINK_INVALID_SIGNATURE' },
        getRequestId(req)
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { walletAddress: address } });
      await tx.walletLinkChallenge.delete({ where: { userId } });
    });

    return NextResponse.json({ ok: true, walletAddress: address });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return jsonApiError(
        409,
        { error: 'This wallet is already linked to another account', code: 'WALLET_LINK_CONFLICT' },
        getRequestId(req)
      );
    }
    return jsonError(err, req);
  }
}
