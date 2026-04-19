import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { JournalList } from '@/components/journals/journal-list';

export default async function MemoriesPage() {
  const t = await getTranslations('journals.memories');

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Loaded from <code className="rounded bg-muted px-1">GET /api/journals</code> (default dev user).
      </p>
      <JournalList />
    </Container>
  );
}
