import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApiUser } from '@/lib/auth/route-guards';
import { jsonApiError, jsonError } from '@/server/services/api-error';
import { getRequestId } from '@/lib/observability/logger';
import { prisma } from '@/lib/db/client';

const bodySchema = z.object({
  defaultPrivacy: z.enum(['private', 'share']),
});

export async function PATCH(req: Request) {
  try {
    const { userId, response } = await requireApiUser(req);
    if (!userId) return response as NextResponse;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return jsonApiError(
        400,
        { error: 'Invalid default privacy payload', code: 'VALIDATION_ERROR' },
        getRequestId(req)
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { defaultPrivacy: parsed.data.defaultPrivacy },
      select: { defaultPrivacy: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return jsonError(err, req);
  }
}
