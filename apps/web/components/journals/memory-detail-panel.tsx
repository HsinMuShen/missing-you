'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ChainVerificationResult, Journal } from '@missing-you/shared';
import { AnchorMemoryControls } from '@/components/blockchain/anchor-memory-controls';

type JournalDetailResponse = Journal & {
  localVerification: boolean | null;
  chainVerification: ChainVerificationResult | null;
};

export function MemoryDetailPanel({ id }: { id: string }) {
  const t = useTranslations('journals.memory');
  const tb = useTranslations('journals.blockchain');
  const [journal, setJournal] = useState<JournalDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      <AnchorMemoryControls journalId={id} journal={journal} onRefresh={load} />

      <section className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
        <h2 className="text-sm font-medium text-foreground">{t('verification')}</h2>
        {journal.anchor ? (
          <>
            <p className="text-sm text-muted-foreground">
              {t('localDigest')}:{' '}
              {journal.localVerification ? t('verified') : t('notVerified')}
            </p>
            <div className="space-y-1 text-xs font-mono text-muted-foreground break-all">
              <p>
                <span className="font-sans font-medium text-foreground">{t('contentHash')}:</span>{' '}
                {journal.anchor.contentHash}
              </p>
              {journal.anchor.txHash ? (
                <p>
                  <span className="font-sans font-medium text-foreground">{t('txHash')}:</span>{' '}
                  {journal.anchor.txHash}
                </p>
              ) : null}
              {journal.anchor.anchoredAt ? (
                <p>
                  <span className="font-sans font-medium text-foreground">{t('anchoredAt')}:</span>{' '}
                  {journal.anchor.anchoredAt}
                </p>
              ) : null}
              {journal.anchor.chainId != null ? (
                <p>
                  <span className="font-sans font-medium text-foreground">{t('chainId')}:</span>{' '}
                  {journal.anchor.chainId} ({journal.anchor.chain})
                </p>
              ) : (
                <p>
                  <span className="font-sans font-medium text-foreground">{t('chain')}:</span>{' '}
                  {journal.anchor.chain}
                </p>
              )}
              {journal.anchor.contractAddress ? (
                <p>
                  <span className="font-sans font-medium text-foreground">{t('contract')}:</span>{' '}
                  {journal.anchor.contractAddress}
                </p>
              ) : null}
            </div>
            {journal.chainVerification ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t('onChainBadge')}:</span>{' '}
                {tb(`chainState.${journal.chainVerification.state}`)}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t('noAnchor')}</p>
        )}
      </section>
    </div>
  );
}
