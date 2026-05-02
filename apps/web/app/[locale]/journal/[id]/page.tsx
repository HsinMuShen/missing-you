import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';
import { requirePageUser } from '@/lib/auth/page-guards';
import { OwnerMemoryDetailPanel } from '@/components/journals/owner-memory-detail-panel';

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function OwnerJournalPage({ params }: Props) {
  const { locale, id } = await params;
  await requirePageUser(locale, `/${locale}/journal/${id}`);
  const t = await getTranslations('journals.owner');

  return (
    <Container className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <Link
        href="/memories"
        className="mb-10 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">&lt;</span>
        <span>{t('backToMemories')}</span>
      </Link>
      <OwnerMemoryDetailPanel id={id} />
    </Container>
  );
}
