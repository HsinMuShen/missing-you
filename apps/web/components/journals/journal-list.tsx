'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@missing-you/ui';
import { actionBtnFullMobile, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';
import { FirstSessionWelcome } from '@/components/journals/first-session-welcome';
import { LoadingBlock } from '@/components/ui/loading-block';

/** Groups names case-insensitively (e.g. "Mom" and "mom" share one section). */
function canonicalPersonKey(raw: string | null | undefined): string {
  const s = raw?.trim() ?? '';
  if (!s) return '';
  return s.toLocaleLowerCase('en-US');
}

function personKey(j: Journal): string {
  return canonicalPersonKey(j.person);
}

function sortPersonKeys(keys: string[]): string[] {
  const named = keys.filter((k) => k !== '').sort((a, b) => a.localeCompare(b, 'en-US'));
  const hasUnnamed = keys.some((k) => k === '');
  return hasUnnamed ? [...named, ''] : named;
}

function headingForPersonGroup(canonicalKey: string, journals: Journal[], noPersonLabel: string): string {
  if (canonicalKey === '') return noPersonLabel;
  const newest = journals[0];
  const display = newest?.person?.trim();
  return display || canonicalKey;
}

export function JournalList() {
  const t = useTranslations('journals.memories');
  const tb = useTranslations('journals.blockchain');
  const [rows, setRows] = useState<Journal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [personFilter, setPersonFilter] = useState<'all' | string>('all');

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

  const grouped = useMemo(() => {
    if (!rows) return null;
    const m = new Map<string, Journal[]>();
    for (const j of rows) {
      const k = personKey(j);
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(j);
    }
    for (const list of m.values()) {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return m;
  }, [rows]);

  const personKeys = useMemo(() => {
    if (!grouped) return [];
    return sortPersonKeys([...grouped.keys()]);
  }, [grouped]);

  const displaySections = useMemo(() => {
    if (!rows?.length || !grouped) return [];
    if (personFilter === 'all') {
      return personKeys
        .map((canonicalKey) => {
          const journals = grouped.get(canonicalKey) ?? [];
          return {
            sectionKey: canonicalKey === '' ? '__unnamed__' : canonicalKey,
            heading: headingForPersonGroup(canonicalKey, journals, t('noPersonGroup')),
            journals,
          };
        })
        .filter((s) => s.journals.length > 0);
    }
    const journals = grouped.get(personFilter) ?? [];
    if (!journals.length) return [];
    return [
      {
        sectionKey: personFilter === '' ? '__unnamed__' : personFilter,
        heading: headingForPersonGroup(personFilter, journals, t('noPersonGroup')),
        journals,
      },
    ];
  }, [grouped, personFilter, personKeys, rows?.length, t]);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  if (rows === null) {
    return <LoadingBlock messageKey="listLoading" />;
  }

  return (
    <>
      <FirstSessionWelcome isEmpty={rows.length === 0} />

      {rows.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-muted-foreground">{t('empty')}</p>
          <Button asChild className={`mt-4 ${actionBtnFullMobile}`}>
            <Link href="/write">{t('emptyCta')}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-col gap-2 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="flex w-full flex-col gap-1.5 text-xs sm:max-w-md">
              <span className="font-medium text-foreground">{t('filterByPerson')}</span>
              <select
                value={personFilter === 'all' ? 'all' : personFilter === '' ? '__unnamed__' : personFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === 'all') setPersonFilter('all');
                  else if (v === '__unnamed__') setPersonFilter('');
                  else setPersonFilter(v);
                }}
                className="min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="all">{t('filterAllPeople')}</option>
                {personKeys.map((canonicalKey) => {
                  const journals = grouped?.get(canonicalKey) ?? [];
                  const label = headingForPersonGroup(canonicalKey, journals, t('noPersonGroup'));
                  return (
                    <option
                      key={canonicalKey === '' ? '__unnamed__' : canonicalKey}
                      value={canonicalKey === '' ? '__unnamed__' : canonicalKey}
                    >
                      {label}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>

          <ul className="mt-6 space-y-8">
            {displaySections.map((section) => (
              <li key={section.sectionKey} className="list-none">
                {personFilter === 'all' ? (
                  <h2 className="mb-3 font-display text-lg font-medium text-foreground">{section.heading}</h2>
                ) : null}
                <ul className="space-y-4">
                  {section.journals.map((j) => (
                    <li
                      key={j.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        {j.title?.trim() ? (
                          <p className="truncate text-sm font-medium text-foreground">{j.title.trim()}</p>
                        ) : null}
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
                      <div className={`${mobileStackActionsEnd} w-full shrink-0 sm:w-auto`}>
                        {j.privacy === 'share' ? (
                          <Link
                            href={`/memory/${j.id}`}
                            className="inline-flex min-h-11 items-center justify-center py-1.5 text-center text-xs text-muted-foreground underline-offset-4 hover:underline sm:min-h-0 sm:justify-start sm:py-0 sm:text-left"
                          >
                            {t('publicPage')}
                          </Link>
                        ) : null}
                        <Button asChild type="button" size="sm" variant="secondary" className={actionBtnFullMobile}>
                          <Link href={`/journal/${j.id}`}>{t('open')}</Link>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
