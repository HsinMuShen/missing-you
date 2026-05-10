import { getTranslations } from 'next-intl/server';
import { Spinner } from '@/components/ui/spinner';

export default async function LocaleSegmentLoading() {
  const t = await getTranslations('common');
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16">
      <Spinner size="lg" label={t('pageLoading')} />
      <p className="text-sm text-muted-foreground">{t('pageLoading')}</p>
    </div>
  );
}
