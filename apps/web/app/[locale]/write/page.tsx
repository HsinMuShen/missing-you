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
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <JournalWriteForm />
    </Container>
  );
}
