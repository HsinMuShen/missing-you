import { getTranslations } from 'next-intl/server';
import { Container } from '@missing-you/ui';
import { MemoryDetailPanel } from '@/components/journals/memory-detail-panel';

type Props = { params: Promise<{ id: string }> };

export default async function PublicMemoryPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations('journals.memory');

  return (
    <Container className="py-16 sm:py-20">
      <p className="text-xs text-muted-foreground font-mono">{id}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <MemoryDetailPanel id={id} />
    </Container>
  );
}
