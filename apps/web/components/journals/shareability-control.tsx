'use client';

import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import type { Journal } from '@missing-you/shared';
import { useShareabilityToggle } from '@/hooks/use-shareability-toggle';

export function ShareabilityControl({
  journal,
  onRefresh,
}: {
  journal: Journal;
  onRefresh: () => Promise<void>;
}) {
  const t = useTranslations('journals.owner');
  const { phase, error, toggle } = useShareabilityToggle(journal, onRefresh);

  const busy = phase === 'switching' || phase === 'signing' || phase === 'saving';
  const isShare = journal.privacy === 'share';

  const errLabel =
    error === 'CONNECT_WALLET'
      ? t('shareNeedsWallet')
      : error === 'USER_REJECTED'
        ? t('shareTxRejected')
        : error === 'SWITCH_NETWORK'
          ? t('shareSwitchNetwork')
          : error;

  return (
    <section className="rounded-lg border border-border bg-card p-4 space-y-3">
      <h3 className="text-sm font-medium text-foreground">{t('visibilityTitle')}</h3>
      <p className="text-xs text-muted-foreground">{t('visibilityHelp')}</p>

      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground">{isShare ? t('shareOn') : t('shareOff')}</span>
        <Button type="button" variant="secondary" disabled={busy} onClick={() => void toggle()}>
          {isShare ? t('makePrivate') : t('makeShareable')}
        </Button>
      </div>

      {busy ? <p className="text-xs text-muted-foreground">{t(`sharePhase.${phase}`)}</p> : null}
      {phase === 'success' ? <p className="text-xs text-stone-600">{t('shareSaved')}</p> : null}
      {errLabel ? <p className="text-sm text-red-700">{errLabel}</p> : null}
    </section>
  );
}
