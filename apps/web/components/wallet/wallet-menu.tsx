'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import { WalletAnchorHelpIcon } from '@/components/help/wallet-anchor-help-icon';
import { Spinner } from '@/components/ui/spinner';

export function WalletMenu() {
  const t = useTranslations('wallet');
  const tc = useTranslations('common');
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const preferredConnector = connectors.find((c) => c.type === 'injected') ?? connectors[0];

  if (isConnected && address) {
    return (
      <div className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono leading-none text-foreground">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => disconnect()}
        >
          {t('disconnect')}
        </Button>
        <WalletAnchorHelpIcon tooltipAlign="inline-end" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="inline-flex items-center gap-1.5">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="inline-flex h-7 items-center gap-1.5 px-2.5 text-xs"
          disabled={!preferredConnector || isPending}
          aria-busy={isPending}
          onClick={() => {
            if (!preferredConnector) return;
            connect({ connector: preferredConnector });
          }}
        >
          {isPending ? <Spinner size="sm" label={tc('connectingWallet')} /> : null}
          {isPending ? tc('connectingWallet') : t('connect')}
        </Button>
        <WalletAnchorHelpIcon tooltipAlign="inline-end" />
      </div>
      {error ? <span className="max-w-[12rem] text-right text-xs text-red-700">{error.message}</span> : null}
    </div>
  );
}
