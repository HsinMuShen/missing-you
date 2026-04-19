'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { polygon, polygonAmoy } from 'viem/chains';
import { getDefaultAnchorChainId } from '@missing-you/shared';
import { injected, walletConnect } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

const wcProjectId =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID : undefined;

/**
 * Polygon-compatible chains for MemoryRegistry. Default chain comes from `NEXT_PUBLIC_ANCHOR_CHAIN_ID`
 * (80002 Amoy or 137 Polygon). Wallet is only needed when submitting `anchorMemory`, not for drafts.
 */
const defaultAnchorChainId = getDefaultAnchorChainId();
const orderedChains =
  defaultAnchorChainId === polygon.id
    ? ([polygon, polygonAmoy] as const)
    : ([polygonAmoy, polygon] as const);

const connectors = [
  injected({ shimDisconnect: true }),
  ...(wcProjectId
    ? [
        walletConnect({
          projectId: wcProjectId,
          showQrModal: true,
          metadata: {
            name: 'Missing You',
            description: 'Preserve memories with gentle on-chain proof',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://missing-you.local',
            icons: [],
          },
        }),
      ]
    : []),
];

const wagmiConfig = createConfig({
  chains: orderedChains,
  connectors,
  transports: {
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
