import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { PublicMemoryList } from '@/components/journals/public-memory-list';
import * as journalService from '@/server/services/journal.service';

type Props = {
  searchParams: Promise<{ page?: string; pageSize?: string; person?: string }>;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

export default async function PublicMemoriesPage({ searchParams }: Props) {
  const t = await getTranslations('journals.publicList');
  const query = await searchParams;
  const page = parsePositiveInt(query.page, 1);
  const pageSize = parsePositiveInt(query.pageSize, 12);
  const person = query.person?.trim() || undefined;
  const list = await journalService.listPublicJournals({ page, pageSize, person });

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        {person ? t('subtitlePerson', { person }) : t('subtitle')}
      </p>
      <PublicMemoryList
        items={list.items}
        page={list.page}
        pageSize={list.pageSize}
        total={list.total}
        personFilter={person}
      />
    </Container>
  );
}
