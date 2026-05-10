'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@missing-you/ui';
import { actionBtnFullMobile, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';

type Props = {
  items: Journal[];
  page: number;
  pageSize: number;
  total: number;
  personFilter?: string;
};

function toExcerpt(content: string, maxLength = 140) {
  const normalized = content.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

function buildHref(page: number, pageSize: number, personFilter?: string) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  if (personFilter) params.set('person', personFilter);
  return `/public-memories?${params.toString()}`;
}

export function PublicMemoryList({ items, page, pageSize, total, personFilter }: Props) {
  const t = useTranslations('journals.publicList');
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const rangeText = useMemo(() => {
    if (total === 0) return t('rangeNone');
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(total, page * pageSize);
    return t('range', { start, end, total });
  }, [page, pageSize, t, total]);

  return (
    <section className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{rangeText}</p>
        {personFilter ? (
          <Link href="/public-memories" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
            {t('clearPerson')}
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          {personFilter ? t('emptyPerson', { person: personFilter }) : t('empty')}
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((journal) => (
            <li key={journal.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
                    new Date(journal.createdAt)
                  )}
                </p>
                {journal.person?.trim() ? (
                  <Link
                    href={buildHref(1, pageSize, journal.person.trim())}
                    className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground hover:bg-muted"
                  >
                    {journal.person.trim()}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">{t('anonymous')}</span>
                )}
              </div>

              {journal.title?.trim() ? (
                <p className="mt-3 text-sm font-medium text-foreground">{journal.title.trim()}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-foreground">{toExcerpt(journal.content)}</p>

              <div className={`${mobileStackActionsEnd} mt-4`}>
                <Button asChild size="sm" variant="secondary" className={actionBtnFullMobile}>
                  <Link href={`/memory/${journal.id}`}>{t('open')}</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={`${mobileStackActionsEnd} pt-2`}>
        {hasPrev ? (
          <Button asChild size="sm" variant="secondary" className={actionBtnFullMobile}>
            <Link href={buildHref(page - 1, pageSize, personFilter)}>{t('prev')}</Link>
          </Button>
        ) : (
          <Button size="sm" variant="secondary" className={actionBtnFullMobile} disabled>
            {t('prev')}
          </Button>
        )}
        {hasNext ? (
          <Button asChild size="sm" variant="secondary" className={actionBtnFullMobile}>
            <Link href={buildHref(page + 1, pageSize, personFilter)}>{t('next')}</Link>
          </Button>
        ) : (
          <Button size="sm" variant="secondary" className={actionBtnFullMobile} disabled>
            {t('next')}
          </Button>
        )}
      </div>
    </section>
  );
}
