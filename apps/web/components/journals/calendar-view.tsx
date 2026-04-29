'use client';

import { useMemo, useState } from 'react';
import type { Journal } from '@missing-you/shared';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@missing-you/ui';

type Props = {
  journals: Journal[];
  openLabel: string;
  previousMonthLabel: string;
  nextMonthLabel: string;
  onSelectDate: (dateTimeLocal: string) => void;
};

function getDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateTimeLocalStartOfDay(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}T12:00`;
}

export function CalendarView({
  journals,
  openLabel,
  previousMonthLabel,
  nextMonthLabel,
  onSelectDate,
}: Props) {
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(new Date()));

  const memoryByDate = useMemo(() => {
    const map = new Map<string, Journal[]>();
    for (const row of journals) {
      const key = row.createdAt.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(row);
      map.set(key, list);
    }
    for (const [key, list] of map.entries()) {
      map.set(
        key,
        [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      );
    }
    return map;
  }, [journals]);

  const gridDays = useMemo(() => {
    const firstDay = startOfMonth(monthCursor);
    const firstWeekday = firstDay.getDay(); // 0 = Sunday
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - firstWeekday);

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + index);
      return day;
    });
  }, [monthCursor]);

  const monthTitle = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(monthCursor);

  const weekdayLabels = useMemo(() => {
    const base = new Date(2026, 0, 4); // Sunday
    return Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(
        new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
      )
    );
  }, []);

  return (
    <div className="mt-8 rounded-lg border border-border bg-card p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
        >
          {previousMonthLabel}
        </Button>
        <h2 className="text-sm font-medium text-foreground">{monthTitle}</h2>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
        >
          {nextMonthLabel}
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdayLabels.map((label) => (
          <div key={label} className="px-2 py-1 text-center text-xs font-medium text-muted-foreground">
            {label}
          </div>
        ))}

        {gridDays.map((day) => {
          const dayKey = getDateKey(day);
          const rows = memoryByDate.get(dayKey) ?? [];
          const firstRow = rows[0];
          const isCurrentMonth = day.getMonth() === monthCursor.getMonth();
          const isToday = dayKey === getDateKey(new Date());

          return (
            <div
              key={dayKey}
              className={`min-h-28 cursor-pointer rounded-md border p-2 transition-colors hover:bg-stone-50 ${
                isCurrentMonth ? 'border-border bg-background' : 'border-border/60 bg-muted/30'
              }`}
              onClick={() => onSelectDate(toDateTimeLocalStartOfDay(day))}
            >
              <p
                className={`mb-1 text-xs ${
                  isToday ? 'font-semibold text-foreground' : isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {day.getDate()}
              </p>
              <div className="space-y-1">
                {rows.slice(0, 3).map((row) => (
                  <Link
                    key={row.id}
                    href={`/journal/${row.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block truncate rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[11px] text-stone-700 hover:bg-stone-100"
                    title={row.content}
                  >
                    {row.content}
                  </Link>
                ))}
                {rows.length > 3 ? (
                  <p className="text-[11px] text-muted-foreground">+{rows.length - 3} more</p>
                ) : null}
                {firstRow ? (
                  <Link
                    href={`/journal/${firstRow.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block text-[11px] text-stone-700 underline-offset-2 hover:underline"
                  >
                    {openLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
