'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { mainnet, polygon, polygonAmoy, sepolia } from 'viem/chains';
import { getDefaultAnchorChainId } from '@missing-you/shared';
import { injected, walletConnect } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

const wcProjectId =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID : undefined;
const amoyRpcUrl =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL : undefined;
const polygonRpcUrl =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL : undefined;
const sepoliaRpcUrl =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL : undefined;
const ethereumMainnetRpcUrl =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL : undefined;

/**
 * EVM chains for MemoryRegistry. Default chain comes from `NEXT_PUBLIC_ANCHOR_CHAIN_ID`.
 * Wallet is only needed when submitting `anchorMemory`, not for drafts.
 */
const defaultAnchorChainId = getDefaultAnchorChainId();
const orderedChains =
  defaultAnchorChainId === mainnet.id
    ? ([mainnet, sepolia, polygon, polygonAmoy] as const)
    : defaultAnchorChainId === polygon.id
      ? ([polygon, mainnet, sepolia, polygonAmoy] as const)
      : defaultAnchorChainId === sepolia.id
        ? ([sepolia, mainnet, polygon, polygonAmoy] as const)
        : ([polygonAmoy, mainnet, sepolia, polygon] as const);

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
    [mainnet.id]: http(ethereumMainnetRpcUrl),
    [polygonAmoy.id]: http(amoyRpcUrl),
    [polygon.id]: http(polygonRpcUrl),
    [sepolia.id]: http(sepoliaRpcUrl),
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
