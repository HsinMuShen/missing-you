'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@missing-you/ui';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { WriteTrustPanel } from '@/components/journals/write-trust-panel';
import { Spinner } from '@/components/ui/spinner';
import { actionBtnFullMobile, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';

export function JournalWriteForm() {
  const t = useTranslations('journals.write');
  const tc = useTranslations('common');
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const [title, setTitle] = useState('');
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
          title: title.trim() === '' ? null : title.trim(),
          content,
          person: person.trim() === '' ? null : person.trim(),
          privacy,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(typeof err.error === 'string' ? err.error : t('error'));
      }
      const created = (await res.json()) as { id: string };
      setTitle('');
      setContent('');
      setPerson('');
      setPrivacy('private');
      setMessage({ type: 'ok', text: t('success') });
      startTransition(() => {
        router.push(`/journal/${created.id}`);
      });
    } catch (err) {
      setMessage({
        type: 'err',
        text: err instanceof Error && err.message ? err.message : t('error'),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 w-full max-w-2xl space-y-6">
      <div>
        <label htmlFor="journal-title" className="block text-sm font-medium text-foreground">
          {t('entryTitle')}
        </label>
        <input
          id="journal-title"
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 sm:min-h-10"
        />
      </div>
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
          className="mt-2 min-h-[11rem] w-full rounded-lg border border-border bg-card px-3 py-3 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 sm:text-sm"
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
          className="mt-2 min-h-11 w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 sm:min-h-10"
        />
      </div>
      <div>
        <span className="block text-sm font-medium text-foreground">{t('privacy')}</span>
        <div className="mt-2 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:gap-6">
          <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap sm:min-h-0">
            <input
              type="radio"
              name="privacy"
              className="h-4 w-4 shrink-0"
              checked={privacy === 'private'}
              onChange={() => setPrivacy('private')}
            />
            <span className="whitespace-nowrap">{t('privacyPrivate')}</span>
          </label>
          <label className="flex min-h-11 shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap sm:min-h-0">
            <input
              type="radio"
              name="privacy"
              className="h-4 w-4 shrink-0"
              checked={privacy === 'share'}
              onChange={() => setPrivacy('share')}
            />
            <span className="whitespace-nowrap">{t('privacyShare')}</span>
          </label>
        </div>
      </div>

      <WriteTrustPanel />

      {message ? (
        <p className={message.type === 'ok' ? 'text-sm text-stone-600' : 'text-sm text-red-700'}>
          {message.text}
        </p>
      ) : null}
      <div className={mobileStackActionsEnd}>
        <Button type="button" asChild className={actionBtnFullMobile}>
          <Link href="/memories">{t('viewMemories')}</Link>
        </Button>
        <Button
          type="submit"
          variant="secondary"
          className={`inline-flex items-center justify-center gap-2 ${actionBtnFullMobile}`}
          disabled={pending || isNavigating}
        >
          {pending || isNavigating ? (
            <Spinner size="sm" label={pending ? t('saving') : tc('navigating')} />
          ) : null}
          {pending ? t('saving') : isNavigating ? tc('navigating') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
