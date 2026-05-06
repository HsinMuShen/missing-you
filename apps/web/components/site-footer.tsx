import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';

export async function SiteFooter() {
  const t = await getTranslations('footer');

  return (
    <footer className="mt-auto border-t border-border/80 py-10 text-sm text-muted-foreground">
      <Container>
        <p>{t('tagline')}</p>
        <nav
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-6 text-xs"
          aria-label={t('learnHeading')}
        >
          <span className="w-full font-medium text-foreground sm:w-auto">{t('learnHeading')}</span>
          <Link href="/qa" className="text-muted-foreground hover:text-foreground hover:underline">
            {t('helpQa')}
          </Link>
          <Link href="/blockchain" className="text-muted-foreground hover:text-foreground hover:underline">
            {t('helpBlockchain')}
          </Link>
          <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground hover:underline">
            {t('helpHowItWorks')}
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
