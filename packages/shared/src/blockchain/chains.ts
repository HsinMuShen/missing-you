import type { Chain } from 'viem';
import { mainnet, polygon, polygonAmoy, sepolia } from 'viem/chains';

/** EVM chains supported for MemoryRegistry anchoring. */
export const ANCHOR_CHAIN_IDS = {
  ethereum: mainnet.id,
  polygon: polygon.id,
  polygonAmoy: polygonAmoy.id,
  sepolia: sepolia.id,
} as const;

export type AnchorChainSlug = keyof typeof ANCHOR_CHAIN_IDS;

export function getAnchorChainById(chainId: number): Chain | undefined {
  if (chainId === mainnet.id) return mainnet;
  if (chainId === polygon.id) return polygon;
  if (chainId === polygonAmoy.id) return polygonAmoy;
  if (chainId === sepolia.id) return sepolia;
  return undefined;
}

export function getDefaultAnchorChainId(): number {
  const raw =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_ANCHOR_CHAIN_ID ?? process.env.NEXT_PUBLIC_CHAIN_ID
      : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (parsed === ANCHOR_CHAIN_IDS.ethereum) return ANCHOR_CHAIN_IDS.ethereum;
  if (parsed === ANCHOR_CHAIN_IDS.polygon) return ANCHOR_CHAIN_IDS.polygon;
  if (parsed === ANCHOR_CHAIN_IDS.sepolia) return ANCHOR_CHAIN_IDS.sepolia;
  return ANCHOR_CHAIN_IDS.polygonAmoy;
}
