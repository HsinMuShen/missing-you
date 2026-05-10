'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ChainVerificationResult, Journal } from '@missing-you/shared';
import { AnchorMemoryControls } from '@/components/blockchain/anchor-memory-controls';
import { ShareabilityControl } from '@/components/journals/shareability-control';
import { Button } from '@missing-you/ui';
import { getTxExplorerUrl } from '@/lib/blockchain/explorer';
import { actionBtnFullMobile, mobileStackActionsBetween, mobileStackActionsEnd } from '@/lib/ui/mobile-action-layout';

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
  const createdDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(journal.createdAt));

  return (
    <div className="mt-6 w-full max-w-3xl space-y-6">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <section className="space-y-5 px-1">
        <p className="text-3xl font-medium leading-tight text-foreground">
          {journal.title?.trim() || t('title')}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1">{createdDate}</span>
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1">
            {t('person')}: {journal.person?.trim() || '-'}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-base leading-8 text-foreground sm:text-lg">{journal.content}</p>
      </section>

      <div className="pt-4">
        <div className="h-px w-full bg-border" />
      </div>

      <div className="space-y-8 pt-2">
        <ShareabilityControl journal={journal} onRefresh={load} />

        <section className="rounded-lg border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-medium text-foreground">{to('shareLinkTitle')}</h3>
          {journal.privacy === 'share' ? (
            <div className={mobileStackActionsBetween}>
              <p className="min-w-0 flex-1 text-xs text-muted-foreground break-all">
                {shareUrl || to('shareLinkUnavailable')}
              </p>
              <div className={`${mobileStackActionsEnd} w-full sm:w-auto`}>
                {copied ? (
                  <span className="text-center text-xs text-stone-600 sm:text-left">{to('copied')}</span>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className={actionBtnFullMobile}
                  onClick={() => void copyShareLink()}
                >
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
                <p>
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
                <div className={mobileStackActionsEnd}>
                  <Button asChild size="sm" variant="secondary" className={actionBtnFullMobile}>
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
    </div>
  );
}
