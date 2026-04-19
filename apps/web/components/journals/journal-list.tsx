'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { Link } from '@/lib/i18n/navigation';

export function JournalList() {
  const t = useTranslations('journals.memories');
  const [rows, setRows] = useState<Journal[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/journals');
        if (!res.ok) throw new Error(t('loadError'));
        const data = (await res.json()) as Journal[];
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setError(t('loadError'));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  if (rows === null) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }
  if (rows.length === 0) {
    return <p className="text-muted-foreground">{t('empty')}</p>;
  }

  return (
    <ul className="mt-8 space-y-4">
      {rows.map((j) => (
        <li
          key={j.id}
          className="rounded-lg border border-border bg-card p-4 shadow-sm flex flex-wrap items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">
              {j.content.slice(0, 120)}
              {j.content.length > 120 ? '…' : ''}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t('status')}: {j.status === 'anchored' ? t('anchored') : t('draft')}
            </p>
          </div>
          <Link
            href={`/memory/${j.id}`}
            className="shrink-0 text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
          >
            {t('open')}
          </Link>
        </li>
      ))}
    </ul>
  );
}
