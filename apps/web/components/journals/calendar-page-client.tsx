'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Journal } from '@missing-you/shared';
import { useTranslations } from 'next-intl';
import { CalendarMemoryForm } from '@/components/journals/calendar-memory-form';
import { CalendarView } from '@/components/journals/calendar-view';
import { LoadingBlock } from '@/components/ui/loading-block';

export function CalendarPageClient() {
  const t = useTranslations('journals.calendar');
  const tm = useTranslations('journals.memories');
  const [rows, setRows] = useState<Journal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/journals');
      if (!res.ok) throw new Error(t('loadError'));
      const data = (await res.json()) as Journal[];
      setRows(data);
    } catch {
      setError(t('loadError'));
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mt-8 space-y-6">
      {selectedDateTime ? (
        <CalendarMemoryForm
          onCreated={load}
          initialDateTime={selectedDateTime}
          onCancel={() => setSelectedDateTime(null)}
        />
      ) : (
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          {t('selectDateHint')}
        </p>
      )}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {rows === null ? (
        <LoadingBlock messageKey="listLoading" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{tm('empty')}</p>
      ) : (
        <CalendarView
          journals={rows}
          openLabel={tm('open')}
          previousMonthLabel={t('prevMonth')}
          nextMonthLabel={t('nextMonth')}
          onSelectDate={setSelectedDateTime}
        />
      )}
    </div>
  );
}
