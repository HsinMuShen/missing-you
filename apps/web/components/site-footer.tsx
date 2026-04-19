import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';

export async function SiteFooter() {
  const t = await getTranslations('footer');

  return (
    <footer className="mt-auto border-t border-border/80 py-10 text-sm text-muted-foreground">
      <Container>
        <p>{t('tagline')}</p>
      </Container>
    </footer>
  );
}
