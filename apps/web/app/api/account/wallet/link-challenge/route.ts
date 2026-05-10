import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUser } from '@/lib/auth/route-guards';
import { enforceUserRateLimit } from '@/lib/rate-limit/enforce';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import { getRequestId } from '@/lib/observability/logger';
import { prisma } from '@/lib/db/client';
import { buildWalletLinkMessage, createWalletLinkNonce } from '@/lib/wallet-link/message';

const bodySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export async function POST(req: Request) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const limited = enforceUserRateLimit(req, userId, 'wallet_link');
    if (limited) return limited;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonApiError(
        400,
        { error: 'Invalid wallet address payload', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }

    const address = parsed.data.address.toLowerCase();
    const nonce = createWalletLinkNonce();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const challenge = await prisma.walletLinkChallenge.upsert({
      where: { userId },
      create: { userId, address, nonce, expiresAt },
      update: { address, nonce, expiresAt },
    });

    const message = buildWalletLinkMessage({
      address,
      nonce,
      userId,
      issuedAt: challenge.updatedAt.toISOString(),
    });
    return NextResponse.json({ message, nonce, expiresAt: challenge.expiresAt.toISOString() });
  } catch (err) {
    return jsonError(err, req);
  }
}
