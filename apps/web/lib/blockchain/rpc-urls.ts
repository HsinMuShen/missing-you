import { getServerRpcUrlByChainId } from '@/lib/config/env';

/**
 * Server-side JSON-RPC URLs for reading receipts and registry state.
 * Never expose private keys here — wallet signing stays in the browser.
 */
export function getServerRpcUrl(chainId: number): string | undefined {
  return getServerRpcUrlByChainId(chainId);
}
