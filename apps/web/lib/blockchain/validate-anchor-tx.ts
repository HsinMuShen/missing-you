import { createPublicClient, http, type Address, type Hex } from 'viem';
import { getAnchorChainById } from '@missing-you/shared';
import { getServerRpcUrl } from '@/lib/blockchain/rpc-urls';

export class AnchorTxValidationError extends Error {
  constructor(
    message: string,
    public readonly httpStatus: number
  ) {
    super(message);
    this.name = 'AnchorTxValidationError';
  }
}

/**
 * Confirms the user-submitted hash landed successfully before we persist `MemoryAnchor`.
 */
export async function assertAnchorTransactionSucceeded(params: {
  chainId: number;
  contractAddress: Address;
  txHash: Hex;
}): Promise<void> {
  const chain = getAnchorChainById(params.chainId);
  if (!chain) {
    throw new AnchorTxValidationError('Unsupported chain for anchoring', 400);
  }

  const url = getServerRpcUrl(params.chainId);
  if (!url) {
    throw new AnchorTxValidationError(
      'Server RPC not configured for this chain (set POLYGON_AMOY_RPC_URL or POLYGON_MAINNET_RPC_URL)',
      503
    );
  }

  const client = createPublicClient({
    chain,
    transport: http(url),
  });

  const receipt = await client.getTransactionReceipt({ hash: params.txHash }).catch(() => null);
  if (!receipt) {
    throw new AnchorTxValidationError('Transaction receipt not found', 400);
  }
  if (receipt.status !== 'success') {
    throw new AnchorTxValidationError('Transaction reverted on-chain', 400);
  }
}
