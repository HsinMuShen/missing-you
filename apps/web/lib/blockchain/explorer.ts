import { getExplorerBaseUrl } from '@/lib/config/env';

export function getTxExplorerUrl(chainId: number | null | undefined, txHash: string): string | null {
  if (!chainId || !txHash) return null;
  const base = getExplorerBaseUrl(chainId);
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/tx/${txHash}`;
}
