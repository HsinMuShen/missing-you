import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getRequestId } from '@/lib/observability/logger';

export async function requireApiUser(req?: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    const requestId = getRequestId(req);
    return {
      userId: null,
      response: NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED', requestId },
        { status: 401 }
      ),
    };
  }

  return {
    userId: session.user.id,
    response: null,
  };
}
