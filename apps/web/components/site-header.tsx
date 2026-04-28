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
    <header className="relative z-50 border-b border-border/80 bg-card/60 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 font-display text-lg font-medium tracking-tight text-foreground"
        >
          {APP_NAME}
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <details className="group relative">
            <summary className="list-none cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted">
              {t('menu')}
            </summary>
            <div className="pointer-events-auto absolute right-0 z-[60] mt-2 w-72 rounded-xl border border-border bg-card p-3 shadow-soft">
              <div className="space-y-1 text-sm">
                <Link href="/write" className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted">
                  {t('write')}
                </Link>
                <Link
                  href="/memories"
                  className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
                >
                  {t('memories')}
                </Link>
                <Link
                  href="/settings"
                  className="block rounded-md px-2 py-1.5 text-foreground hover:bg-muted"
                >
                  {t('settings')}
                </Link>
              </div>

              <div className="my-3 h-px bg-border" />

              {session?.user?.id ? (
                <div className="space-y-2">
                  <p className="truncate rounded-md border border-border bg-muted/30 px-2 py-1 text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                  <SignOutButton label={t('signOut')} className="w-full justify-center" />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="block rounded-md border border-border px-2 py-1.5 text-center text-xs text-foreground hover:bg-muted"
                >
                  {t('signIn')}
                </Link>
              )}

              <div className="my-3 h-px bg-border" />
              <WalletMenu />
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
