import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { JournalWriteForm } from '@/components/journals/journal-write-form';
import { requirePageUser } from '@/lib/auth/page-guards';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function WritePage({ params }: Props) {
  const { locale } = await params;
  await requirePageUser(locale, `/${locale}/write`);
  const t = await getTranslations('journals.write');

  return (
    <Container className="px-4 py-12 sm:px-6 sm:py-20">
      <h1 className="font-display text-2xl font-medium text-foreground sm:text-3xl">{t('title')}</h1>
      <JournalWriteForm />
    </Container>
  );
}
