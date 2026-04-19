import { prisma } from '@/lib/db/client';

/**
 * Stable UUID for the anonymous MVP user when no auth and no `userId` is passed.
 * RFC 4122 variant/version bits are valid for tooling that cares.
 */
export const DEFAULT_DEV_USER_ID = '00000000-0000-4000-8000-000000000001';

/**
 * Ensures a row exists for default journaling before first create/list.
 * Replace with real session user resolution when auth lands.
 */
export async function getDefaultUserId(): Promise<string> {
  const fromEnv = process.env.DEFAULT_USER_ID;
  const id = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_DEV_USER_ID;

  await ensureUserId(id);

  return id;
}

/** Ensures a `User` row exists (for custom `userId` on create until auth owns provisioning). */
export async function ensureUserId(id: string): Promise<void> {
  await prisma.user.upsert({
    where: { id },
    create: { id },
    update: {},
  });
}
