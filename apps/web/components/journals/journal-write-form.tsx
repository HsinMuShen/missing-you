'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';

export function JournalWriteForm() {
  const t = useTranslations('journals.write');
  const [content, setContent] = useState('');
  const [person, setPerson] = useState('');
  const [privacy, setPrivacy] = useState<'private' | 'share'>('private');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          person: person.trim() === '' ? null : person.trim(),
          privacy,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === 'string' ? err.error : t('error'));
      }
      setContent('');
      setPerson('');
      setPrivacy('private');
      setMessage({ type: 'ok', text: t('success') });
    } catch {
      setMessage({ type: 'err', text: t('error') });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-6">
      <div>
        <label htmlFor="journal-content" className="block text-sm font-medium text-foreground">
          {t('content')}
        </label>
        <textarea
          id="journal-content"
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
      <div>
        <label htmlFor="journal-person" className="block text-sm font-medium text-foreground">
          {t('person')}
        </label>
        <p className="mt-1 text-xs text-muted-foreground">{t('personHint')}</p>
        <input
          id="journal-person"
          type="text"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>
      <div>
        <span className="block text-sm font-medium text-foreground">{t('privacy')}</span>
        <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="privacy"
              checked={privacy === 'private'}
              onChange={() => setPrivacy('private')}
            />
            {t('privacyPrivate')}
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="privacy"
              checked={privacy === 'share'}
              onChange={() => setPrivacy('share')}
            />
            {t('privacyShare')}
          </label>
        </div>
      </div>
      {message ? (
        <p className={message.type === 'ok' ? 'text-sm text-stone-600' : 'text-sm text-red-700'}>
          {message.text}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? t('saving') : t('submit')}
        </Button>
        <Button type="button" variant="secondary" asChild>
          <Link href="/memories">{t('viewMemories')}</Link>
        </Button>
      </div>
    </form>
  );
}
