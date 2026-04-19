import type { Chain } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';

/** Polygon-family chains supported for MemoryRegistry anchoring in this MVP. */
export const ANCHOR_CHAIN_IDS = {
  polygon: polygon.id,
  polygonAmoy: polygonAmoy.id,
} as const;

export type AnchorChainSlug = keyof typeof ANCHOR_CHAIN_IDS;

export function getAnchorChainById(chainId: number): Chain | undefined {
  if (chainId === polygon.id) return polygon;
  if (chainId === polygonAmoy.id) return polygonAmoy;
  return undefined;
}

export function getDefaultAnchorChainId(): number {
  const raw = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ANCHOR_CHAIN_ID : undefined;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (parsed === ANCHOR_CHAIN_IDS.polygon) return ANCHOR_CHAIN_IDS.polygon;
  return ANCHOR_CHAIN_IDS.polygonAmoy;
}
