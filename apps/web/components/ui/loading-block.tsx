'use client';

import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  /** i18n key under `common` — default pageLoading */
  messageKey?: 'pageLoading' | 'listLoading' | 'detailLoading';
  className?: string;
};

export function LoadingBlock({ messageKey = 'pageLoading', className }: Props) {
  const t = useTranslations('common');
  return (
    <div
      className={`flex min-h-[12rem] flex-col items-center justify-center gap-3 px-4 py-8 ${className ?? ''}`}
    >
      <Spinner size="lg" label={t(messageKey)} />
      <p className="text-sm text-muted-foreground">{t(messageKey)}</p>
    </div>
  );
}
