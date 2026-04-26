import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container } from '@missing-you/ui';
import { LanguageSwitcher } from '@/components/language-switcher';
import { WalletMenu } from '@/components/wallet/wallet-menu';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { APP_NAME } from '@missing-you/shared';
import { auth } from '@/auth';

export async function SiteHeader() {
  const t = await getTranslations('nav');
  const session = await auth();

  return (
    <header className="border-b border-border/80 bg-card/60 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-lg font-medium tracking-tight text-foreground">
          {APP_NAME}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/write" className="hover:text-foreground">
            {t('write')}
          </Link>
          <Link href="/memories" className="hover:text-foreground">
            {t('memories')}
          </Link>
          <Link href="/settings" className="hover:text-foreground">
            {t('settings')}
          </Link>

          {session?.user?.id ? (
            <>
              <span className="text-xs text-muted-foreground">{session.user.email}</span>
              <SignOutButton label={t('signOut')} />
            </>
          ) : (
            <Link href="/sign-in" className="hover:text-foreground">
              {t('signIn')}
            </Link>
          )}

          <WalletMenu />
          <LanguageSwitcher />
        </nav>
      </Container>
    </header>
  );
}
