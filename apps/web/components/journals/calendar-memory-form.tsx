'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';
import { actionBtnFullMobile, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';

type Props = {
  onCreated: () => Promise<void>;
  initialDateTime: string;
  onCancel: () => void;
};

function nowInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  const hh = `${now.getHours()}`.padStart(2, '0');
  const mm = `${now.getMinutes()}`.padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function splitDateTime(value: string) {
  const [datePart, timePart] = value.split('T');
  return {
    date: datePart ?? '',
    time: timePart?.slice(0, 5) ?? '12:00',
  };
}

export function CalendarMemoryForm({ onCreated, initialDateTime, onCancel }: Props) {
  const t = useTranslations('journals.calendar');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [person, setPerson] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'share'>('private');
  const initialParts = splitDateTime(initialDateTime);
  const [date, setDate] = useState(initialParts.date);
  const [time, setTime] = useState(initialParts.time);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const maxDateTime = useMemo(() => nowInputValue(), []);
  const maxDate = maxDateTime.slice(0, 10);
  const maxTimeToday = maxDateTime.slice(11, 16);
  const isTodaySelected = date === maxDate;
  const timeOptions = useMemo(() => {
    const list: string[] = [];
    for (let h = 0; h < 24; h += 1) {
      for (let m = 0; m < 60; m += 30) {
        const label = `${`${h}`.padStart(2, '0')}:${`${m}`.padStart(2, '0')}`;
        if (isTodaySelected && label > maxTimeToday) continue;
        list.push(label);
      }
    }
    return list;
  }, [isTodaySelected, maxTimeToday]);

  useEffect(() => {
    const next = splitDateTime(initialDateTime);
    setDate(next.date);
    setTime(next.time);
  }, [initialDateTime]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);

    try {
      const createdAt = new Date(`${date}T${time}:00`);
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() ? title.trim() : null,
          content,
          person: person.trim() ? person.trim() : null,
          privacy,
          createdAt: createdAt.toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === 'string' ? err.error : t('createError'));
      }

      setTitle('');
      setContent('');
      setPerson('');
      setPrivacy('private');
      const nextNow = splitDateTime(nowInputValue());
      setDate(nextNow.date);
      setTime(nextNow.time);
      setMessage({ type: 'ok', text: t('createSuccess') });
      await onCreated();
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error && err.message ? err.message : t('createError'),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-border bg-card p-4 space-y-4">
      <h2 className="text-sm font-medium text-foreground">{t('addTitle')}</h2>
      <div>
        <label className="block text-sm text-foreground">{t('entryTitle')}</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>
      <div>
        <label className="block text-sm text-foreground">{t('content')}</label>
        <textarea
          required
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-foreground">{t('person')}</label>
          <input
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm text-foreground">{t('datetime')}</label>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            <input
              type="date"
              required
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              {timeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <span className="block text-sm text-foreground">{t('privacy')}</span>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap">
            <input type="radio" checked={privacy === 'private'} onChange={() => setPrivacy('private')} />
            <span className="whitespace-nowrap">{t('privacyPrivate')}</span>
          </label>
          <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap">
            <input type="radio" checked={privacy === 'share'} onChange={() => setPrivacy('share')} />
            <span className="whitespace-nowrap">{t('privacyShare')}</span>
          </label>
        </div>
      </div>

      {message ? (
        <p className={message.type === 'ok' ? 'text-sm text-stone-600' : 'text-sm text-red-700'}>{message.text}</p>
      ) : null}

      <div className={mobileStackActionsEnd}>
        <Button type="button" size="sm" variant="secondary" className={actionBtnFullMobile} onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button
          type="submit"
          size="sm"
          className={`inline-flex items-center justify-center gap-2 ${actionBtnFullMobile}`}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? <Spinner size="sm" label={t('creating')} /> : null}
          {pending ? t('creating') : t('create')}
        </Button>
      </div>
    </form>
  );
}
