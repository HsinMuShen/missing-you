'use client';

import { useState } from 'react';
import type { Journal } from '@missing-you/shared';
import { useAccount } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useAnchorMemory } from '@/hooks/use-anchor-memory';
import { useTranslations } from 'next-intl';
import { WalletAnchorHelpIcon } from '@/components/help/wallet-anchor-help-icon';
import {
  actionBtnFullMobile,
  mobileStackActionsBetween,
  mobileStackActionsEnd,
  mobileStackActionsEndTight,
} from '@/lib/ui/mobile-action-layout';
import type { Hex } from 'viem';

type Props = {
  journalId: string;
  journal: Journal;
  onRefresh: () => Promise<void>;
};

export function AnchorMemoryControls({ journalId, journal, onRefresh }: Props) {
  const t = useTranslations('journals.blockchain');
  const { isConnected } = useAccount();
  const { phase, error, lastTxHash, runAnchor, recoverFromConfirmedTx, reset } = useAnchorMemory(
    journalId,
    onRefresh
  );
  const [recoveryTxHash, setRecoveryTxHash] = useState('');
  const busy = ['preparing', 'switching', 'signing', 'confirming'].includes(phase);

  if (journal.status !== 'draft') {
    return null;
  }

  const errLabel =
    error === 'CONNECT_WALLET'
      ? t('connectWallet')
      : error === 'USER_REJECTED'
        ? t('userRejected')
        : error === 'ALREADY_ANCHORED'
          ? t('alreadyAnchored')
        : error === 'SWITCH_NETWORK'
          ? t('switchNetwork')
          : error;

  const recoveryHashValid = /^0x[a-fA-F0-9]{64}$/.test(recoveryTxHash.trim());

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-foreground">{t('title')}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{t('body')}</p>

      {!isConnected ? (
        <div className={`${mobileStackActionsBetween} items-start sm:items-end`}>
          <p className="flex-1 text-sm leading-snug text-amber-900/90">{t('connectPrompt')}</p>
          <WalletAnchorHelpIcon className="self-center sm:self-auto sm:translate-y-px" />
        </div>
      ) : (
        <div className={mobileStackActionsEndTight}>
          <Button
            type="button"
            size="sm"
            className={actionBtnFullMobile}
            disabled={busy}
            onClick={() => void runAnchor()}
          >
            {t('cta')}
          </Button>
          <WalletAnchorHelpIcon className="self-center sm:self-auto" />
        </div>
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

      {phase === 'error' ? (
        <div className="space-y-2 rounded-md border border-border/80 bg-background p-3">
          <p className="text-xs text-muted-foreground">{t('recoveryHint')}</p>
          <input
            type="text"
            placeholder={t('recoveryPlaceholder')}
            value={recoveryTxHash}
            onChange={(e) => setRecoveryTxHash(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-xs font-mono text-foreground"
          />
          <div className={mobileStackActionsEnd}>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className={actionBtnFullMobile}
              disabled={!recoveryHashValid || busy}
              onClick={() => void recoverFromConfirmedTx(recoveryTxHash.trim() as Hex)}
            >
              {t('recoveryCta')}
            </Button>
          </div>
        </div>
      ) : null}

      {phase === 'error' || phase === 'success' ? (
        <div className={mobileStackActionsEnd}>
          <Button type="button" variant="secondary" size="sm" className={actionBtnFullMobile} onClick={reset}>
            {t('reset')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
