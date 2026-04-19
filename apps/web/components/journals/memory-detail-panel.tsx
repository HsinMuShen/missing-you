'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { Button } from '@missing-you/ui';

type JournalDetailResponse = Journal & { localVerification: boolean | null };

export function MemoryDetailPanel({ id }: { id: string }) {
  const t = useTranslations('journals.memory');
  const [journal, setJournal] = useState<JournalDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`/api/journals/${id}`);
      if (!res.ok) throw new Error(t('loadError'));
      const data = (await res.json()) as JournalDetailResponse;
      setJournal(data);
    } catch {
      setError(t('loadError'));
    }
  }, [id, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function prepare() {
    setBusy(true);
    try {
      const res = await fetch(`/api/journals/${id}/prepare-anchor`, { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : 'prepare failed');
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'prepare failed');
    } finally {
      setBusy(false);
    }
  }

  async function confirmMock() {
    setBusy(true);
    try {
      const res = await fetch(`/api/journals/${id}/confirm-anchor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: '0x' + '00'.repeat(32) }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : 'confirm failed');
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'confirm failed');
    } finally {
      setBusy(false);
    }
  }

  if (error && !journal) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  if (!journal) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  return (
    <div className="mt-6 space-y-8 max-w-xl">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">{t('person')}</h2>
        <p className="text-foreground">{journal.person ?? '—'}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">{t('privacy')}</h2>
        <p className="text-foreground">{journal.privacy}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">{t('content')}</h2>
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">{journal.content}</p>
      </section>

      <section className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
        <h2 className="text-sm font-medium text-foreground">{t('verification')}</h2>
        {journal.anchor ? (
          <p className="text-sm text-muted-foreground">
            {journal.localVerification ? t('verified') : t('notVerified')}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">{t('noAnchor')}</p>
        )}
      </section>

      {journal.status === 'draft' ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="space-y-1">
            <Button type="button" variant="secondary" disabled={busy} onClick={() => void prepare()}>
              {t('prepare')}
            </Button>
            <p className="text-xs text-muted-foreground max-w-xs">{t('prepareHint')}</p>
          </div>
          <div className="space-y-1">
            <Button type="button" disabled={busy} onClick={() => void confirmMock()}>
              {t('confirmMock')}
            </Button>
            <p className="text-xs text-muted-foreground max-w-xs">{t('confirmHint')}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
