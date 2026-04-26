import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function requirePageUser(locale: string, nextPath: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/sign-in?next=${encodeURIComponent(nextPath)}`);
  }
  return session.user;
}
