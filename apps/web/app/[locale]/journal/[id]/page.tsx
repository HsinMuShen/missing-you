import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { requirePageUser } from '@/lib/auth/page-guards';
import { OwnerMemoryDetailPanel } from '@/components/journals/owner-memory-detail-panel';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function OwnerJournalPage({ params }: Props) {
  const { locale, id } = await params;
  await requirePageUser(locale, `/${locale}/journal/${id}`);
  const t = await getTranslations('journals.owner');

  return (
    <Container className="py-16 sm:py-20">
      <p className="text-xs text-muted-foreground font-mono">{id}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>
      <OwnerMemoryDetailPanel id={id} />
    </Container>
  );
}
