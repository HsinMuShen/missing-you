import { createPublicClient, http, type Address } from 'viem';
import { getAnchorChainById } from '@missing-you/shared';
import { getServerRpcUrl } from '@/lib/blockchain/rpc-urls';

/** Read-only client for server-side proof checks. */
export function getAnchorReadClient(chainId: number) {
  const chain = getAnchorChainById(chainId);
  const url = getServerRpcUrl(chainId);
  if (!chain || !url) {
    return null;
  }
  return createPublicClient({ chain, transport: http(url) });
}

export type { Address };
