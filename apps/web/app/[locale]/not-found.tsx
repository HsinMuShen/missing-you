import { getTranslations } from 'next-intl/server';
import { Link } from '@/lib/i18n/navigation';
import { Container } from '@missing-you/ui';
import { Button } from '@missing-you/ui';
import { actionBtnFullMobile } from '@/lib/ui/mobile-action-layout';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <Container className="py-24 text-center">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-3 text-muted-foreground">{t('body')}</p>
      <Button asChild className={`mt-8 ${actionBtnFullMobile}`} variant="secondary">
        <Link href="/">{t('cta')}</Link>
      </Button>
    </Container>
  );
}
