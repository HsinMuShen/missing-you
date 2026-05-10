import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { JournalList } from '@/components/journals/journal-list';
import { requirePageUser } from '@/lib/auth/page-guards';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MemoriesPage({ params }: Props) {
  const { locale } = await params;
  await requirePageUser(locale, `/${locale}/memories`);
  const t = await getTranslations('journals.memories');

  return (
    <Container className="px-4 py-12 sm:px-6 sm:py-20">
      <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl">{t('title')}</h1>
      <p className="mt-2 max-w-xl pb-4 text-sm text-muted-foreground">{t('subtitle')}</p>
      <JournalList />
    </Container>
  );
}
