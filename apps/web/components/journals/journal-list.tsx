'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@missing-you/ui';

export function JournalList() {
  const t = useTranslations('journals.memories');
  const tb = useTranslations('journals.blockchain');
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
    return <p className="text-sm text-muted-foreground">{t('loading')}</p>;
  }
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
        <Button asChild className="mt-4">
          <Link href="/write">{t('emptyCta')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {rows.map((j) => (
        <li
          key={j.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
        >
          <div className="min-w-0 flex-1">
            {j.title?.trim() ? <p className="truncate text-sm font-medium text-foreground">{j.title.trim()}</p> : null}
            <p className="truncate text-sm text-foreground">
              {j.content.slice(0, 120)}
              {j.content.length > 120 ? '…' : ''}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>
                {t('status')}: {j.status === 'anchored' ? t('anchored') : t('draft')}
              </span>
              <span>
                {t('visibility')}: {j.privacy === 'share' ? t('share') : t('private')}
              </span>
              {j.status === 'anchored' && j.anchor?.txHash && j.anchor.txHash.length > 14 ? (
                <span className="font-mono">
                  {tb('listTx')}: {j.anchor.txHash.slice(0, 10)}…{j.anchor.txHash.slice(-6)}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {j.privacy === 'share' ? (
              <Link
                href={`/memory/${j.id}`}
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                {t('publicPage')}
              </Link>
            ) : null}
            <Button asChild type="button" size="sm" variant="secondary">
              <Link href={`/journal/${j.id}`} className="shrink-0">
                {t('open')}
              </Link>
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
