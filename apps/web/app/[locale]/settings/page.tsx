import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';

/** Future: locale default, wallet link, privacy defaults. */
export default async function SettingsPage() {
  const t = await getTranslations('placeholders.settings');

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">{t('body')}</p>
    </Container>
  );
}
