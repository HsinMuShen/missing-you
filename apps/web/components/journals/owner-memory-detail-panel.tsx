'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ChainVerificationResult, Journal } from '@missing-you/shared';
import { AnchorMemoryControls } from '@/components/blockchain/anchor-memory-controls';
import { ShareabilityControl } from '@/components/journals/shareability-control';
import { Button } from '@missing-you/ui';
import { getTxExplorerUrl } from '@/lib/blockchain/explorer';

type JournalDetailResponse = Journal & {
  localVerification: boolean | null;
  chainVerification: ChainVerificationResult | null;
};

export function OwnerMemoryDetailPanel({ id }: { id: string }) {
  const t = useTranslations('journals.memory');
  const tb = useTranslations('journals.blockchain');
  const to = useTranslations('journals.owner');
  const [journal, setJournal] = useState<JournalDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const locale = window.location.pathname.split('/').filter(Boolean)[0] ?? 'en';
    setShareUrl(`${window.location.origin}/${locale}/memory/${id}`);
  }, [id]);

  async function copyShareLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  if (error && !journal) {
    return <p className="text-sm text-red-700">{error}</p>;
  }
  if (!journal) {
    return <p className="text-sm text-muted-foreground">{to('loading')}</p>;
  }

  const explorer = getTxExplorerUrl(journal.anchor?.chainId, journal.anchor?.txHash ?? '');

  return (
    <div className="mt-6 w-full space-y-8">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">{t('person')}</h2>
        <p className="text-foreground">{journal.person ?? '—'}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">{t('content')}</h2>
        <p className="whitespace-pre-wrap text-foreground leading-relaxed">{journal.content}</p>
      </section>

      <ShareabilityControl journal={journal} onRefresh={load} />

      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">{to('shareLinkTitle')}</h3>
        {journal.privacy === 'share' ? (
          <div className="flex items-end justify-between gap-3">
            <p className="min-w-0 flex-1 text-xs text-muted-foreground break-all">
              {shareUrl || to('shareLinkUnavailable')}
            </p>
            <div className="flex items-center gap-2">
              {copied ? <span className="text-xs text-stone-600">{to('copied')}</span> : null}
              <Button type="button" size="sm" variant="secondary" onClick={() => void copyShareLink()}>
                {to('copyShareLink')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            {to('shareLinkPrivate')}
          </div>
        )}
      </section>

      <AnchorMemoryControls journalId={id} journal={journal} onRefresh={load} />

      <section className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
        <h2 className="text-sm font-medium text-foreground">{t('verification')}</h2>
        {journal.anchor ? (
          <>
            <p className="text-sm text-muted-foreground">
              {t('localDigest')}: {journal.localVerification ? t('verified') : t('notVerified')}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t('onChainBadge')}:</span>{' '}
              {tb(`chainState.${journal.chainVerification?.state ?? 'skipped_no_anchor'}`)}
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
            </div>
            {explorer ? (
              <div className="flex justify-end">
                <Button asChild size="sm" variant="secondary">
                  <a href={explorer} target="_blank" rel="noreferrer">
                    {to('viewExplorer')}
                  </a>
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{to('notAnchored')}</p>
        )}
      </section>
    </div>
  );
}
