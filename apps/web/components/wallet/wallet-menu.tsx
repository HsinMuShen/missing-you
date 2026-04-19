'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@missing-you/ui';
import { useTranslations } from 'next-intl';

export function WalletMenu() {
  const t = useTranslations('wallet');
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono text-foreground">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={() => disconnect()}>
          {t('disconnect')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {connectors.map((c) => (
          <Button
            key={c.uid}
            type="button"
            variant="secondary"
            size="sm"
            disabled={!c.ready || isPending}
            onClick={() => connect({ connector: c })}
          >
            {c.name}
          </Button>
        ))}
      </div>
      {error ? <span className="max-w-[12rem] text-right text-xs text-red-700">{error.message}</span> : null}
    </div>
  );
}
