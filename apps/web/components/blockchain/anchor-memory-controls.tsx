'use client';

import type { Journal } from '@missing-you/shared';
import { useAccount } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useAnchorMemory } from '@/hooks/use-anchor-memory';
import { useTranslations } from 'next-intl';

type Props = {
  journalId: string;
  journal: Journal;
  onRefresh: () => Promise<void>;
};

export function AnchorMemoryControls({ journalId, journal, onRefresh }: Props) {
  const t = useTranslations('journals.blockchain');
  const { isConnected } = useAccount();
  const { phase, error, lastTxHash, runAnchor, reset } = useAnchorMemory(journalId, onRefresh);
  const busy = ['preparing', 'switching', 'signing', 'confirming'].includes(phase);

  if (journal.status !== 'draft') {
    return null;
  }

  const errLabel =
    error === 'CONNECT_WALLET'
      ? t('connectWallet')
      : error === 'USER_REJECTED'
        ? t('userRejected')
        : error === 'SWITCH_NETWORK'
          ? t('switchNetwork')
          : error;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-foreground">{t('title')}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{t('body')}</p>

      {!isConnected ? (
        <p className="text-sm text-amber-900/90">{t('connectPrompt')}</p>
      ) : (
        <Button type="button" disabled={busy} onClick={() => void runAnchor()}>
          {t('cta')}
        </Button>
      )}

      {phase !== 'idle' && phase !== 'error' ? (
        <p className="text-xs text-muted-foreground">{t(`phase.${phase}`)}</p>
      ) : null}

      {phase === 'success' && lastTxHash ? (
        <p className="break-all text-xs font-mono text-muted-foreground">
          {t('txHash')}: {lastTxHash}
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-700">{errLabel}</p> : null}

      {phase === 'error' || phase === 'success' ? (
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          {t('reset')}
        </Button>
      ) : null}
    </div>
  );
}
