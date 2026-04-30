import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { requirePageUser } from '@/lib/auth/page-guards';
import { CalendarPageClient } from '@/components/journals/calendar-page-client';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  await requirePageUser(locale, `/${locale}/calendar`);
  const t = await getTranslations('journals.calendar');

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t('subtitle')}</p>
      <CalendarPageClient />
    </Container>
  );
}
