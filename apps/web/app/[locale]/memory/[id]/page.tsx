import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container } from '@missing-you/ui';
import { getJournalChainVerification } from '@/server/services/blockchain-proof.service';
import * as journalService from '@/server/services/journal.service';
import { getTxExplorerUrl } from '@/lib/blockchain/explorer';
import { getPublicAppUrl } from '@/lib/config/env';

type Props = { params: Promise<{ locale: string; id: string }> };

async function getPublicJournal(id: string) {
  try {
    const journal = await journalService.getJournalById(id);
    if (journal.privacy !== 'share') return null;
    return journal;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const journal = await getPublicJournal(id);
  const appUrl = getPublicAppUrl();

  if (!journal) {
    return {
      title: 'Missing You',
      description: 'Memory unavailable',
      robots: { index: false, follow: false },
      metadataBase: new URL(appUrl),
    };
  }

  const title = 'Shared Memory · Missing You';
  const description = journal.anchor
    ? 'This memory is shared with cryptographic proof anchored on-chain.'
    : 'This memory is shared from Missing You.';

  return {
    metadataBase: new URL(appUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/${(await params).locale}/memory/${id}`,
    },
  };
}

export default async function PublicMemoryPage({ params }: Props) {
  const { locale, id } = await params;
  const t = await getTranslations('journals.public');

  const journal = await getPublicJournal(id);
  if (!journal) {
    notFound();
  }

  const chainVerification = await getJournalChainVerification(journal);
  const explorer = getTxExplorerUrl(journal.anchor?.chainId, journal.anchor?.txHash ?? '');

  const createdDate = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(journal.createdAt));

  return (
    <Container className="py-16 sm:py-20 max-w-2xl">
      <p className="text-xs text-muted-foreground font-mono">{id}</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-foreground">{t('title')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t('subtitle')}</p>

      <div className="mt-8 space-y-5 rounded-lg border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground">{t('createdAt')}: {createdDate}</p>
        {journal.person ? (
          <p className="text-sm text-muted-foreground">
            {t('person')}: <span className="text-foreground">{journal.person}</span>
          </p>
        ) : null}

        <div className="rounded-lg bg-muted/50 p-4">
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{journal.content}</p>
        </div>
      </div>

      <section className="mt-8 rounded-lg border border-border bg-muted/40 p-4 space-y-3">
        <h2 className="text-sm font-medium text-foreground">{t('proofTitle')}</h2>

        {journal.anchor ? (
          <>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t('status')}:</span>{' '}
              {t(`state.${chainVerification.state}`)}
            </p>
            <p className="text-xs font-mono break-all text-muted-foreground">
              {t('contentHash')}: {journal.anchor.contentHash}
            </p>
            {journal.anchor.txHash ? (
              <p className="text-xs font-mono break-all text-muted-foreground">
                {t('txHash')}: {journal.anchor.txHash}
              </p>
            ) : null}
            {journal.anchor.anchoredAt ? (
              <p className="text-xs text-muted-foreground">
                {t('anchoredAt')}: {new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(journal.anchor.anchoredAt))}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {t('network')}: {journal.anchor.chainId ?? '—'} ({journal.anchor.chain})
            </p>
            {explorer ? (
              <a
                href={explorer}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm text-stone-700 underline-offset-4 hover:underline"
              >
                {t('viewExplorer')}
              </a>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t('state.skipped_no_anchor')}</p>
        )}
      </section>
    </Container>
  );
}
