import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container } from '@missing-you/ui';
import { LanguageSwitcher } from '@/components/language-switcher';
import { APP_NAME } from '@missing-you/shared';

export async function SiteHeader() {
  const t = await getTranslations('nav');

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
          <LanguageSwitcher />
        </nav>
      </Container>
    </header>
  );
}
