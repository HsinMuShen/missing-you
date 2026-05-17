'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { Connector } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';
import { WalletAnchorHelpIcon } from '@/components/help/wallet-anchor-help-icon';
import { Spinner } from '@/components/ui/spinner';

function pickConnector(connectors: readonly Connector[]) {
  const injected = connectors.find((c) => c.type === 'injected');
  const walletConnect = connectors.find((c) => c.type === 'walletConnect');
  if (injected?.ready) return injected;
  if (walletConnect) return walletConnect;
  return injected ?? connectors[0];
}

export function WalletMenu() {
  const t = useTranslations('wallet');
  const tc = useTranslations('common');
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error, reset, status } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = useMemo(() => pickConnector(connectors), [connectors]);
  const connectStatusRef = useRef(status);
  connectStatusRef.current = status;

  // Recover from a previous stuck connect (menu closed mid-flight).
  useEffect(() => {
    if (status === 'pending') {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Closing the menu unmounts this component; clear a stuck pending connect.
  useEffect(() => {
    return () => {
      if (connectStatusRef.current === 'pending') {
        reset();
      }
    };
  }, [reset]);

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
    <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
      <div className="inline-flex items-center gap-1.5">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="inline-flex h-7 items-center gap-1.5 px-2.5 text-xs"
          disabled={!connector || isPending}
          aria-busy={isPending}
          onClick={() => {
            if (!connector || isPending) return;
            connect({ connector });
          }}
        >
          {isPending ? <Spinner size="sm" label={tc('connectingWallet')} /> : null}
          {isPending ? tc('connectingWallet') : t('connect')}
        </Button>
        <WalletAnchorHelpIcon tooltipAlign="inline-end" />
      </div>
      {error ? (
        <span className="max-w-[12rem] text-right text-xs text-red-700">{error.message}</span>
      ) : null}
    </div>
  );
}
