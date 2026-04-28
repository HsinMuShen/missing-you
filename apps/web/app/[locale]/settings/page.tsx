import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { requirePageUser } from '@/lib/auth/page-guards';
import { prisma } from '@/lib/db/client';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { WalletLinkControls } from '@/components/settings/wallet-link-controls';
import { DefaultPrivacyControl } from '@/components/settings/default-privacy-control';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const user = await requirePageUser(locale, `/${locale}/settings`);
  const t = await getTranslations('settings');

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, walletAddress: true, defaultPrivacy: true },
  });

  return (
    <Container className="py-16 sm:py-20 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">{t('subtitle')}</p>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="text-sm text-muted-foreground">{t('email')}</p>
        <p className="text-foreground">{dbUser?.email ?? user.email ?? '—'}</p>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="text-sm text-muted-foreground">{t('defaultPrivacy')}</p>
        <DefaultPrivacyControl initialValue={(dbUser?.defaultPrivacy as 'private' | 'share') ?? 'private'} />
      </section>

      <section className="rounded-lg border border-border bg-card p-5 space-y-2">
        <p className="text-sm text-muted-foreground">{t('walletLinking')}</p>
        <WalletLinkControls linkedWalletAddress={dbUser?.walletAddress ?? null} />
      </section>

      <SignOutButton label={t('signOut')} />
    </Container>
  );
}
