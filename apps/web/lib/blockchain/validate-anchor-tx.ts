import {
  createPublicClient,
  http,
  type Address,
  type Hex,
  WaitForTransactionReceiptTimeoutError,
} from 'viem';
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

/** Default wait: public testnet RPCs often index receipts tens of seconds after MetaMask shows “confirmed”. */
const RECEIPT_WAIT_MS = (() => {
  const raw = Number(process.env.ANCHOR_RECEIPT_WAIT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 120_000;
})();

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
      'Server RPC not configured for this chain (set SEPOLIA_RPC_URL, POLYGON_AMOY_RPC_URL, or POLYGON_MAINNET_RPC_URL)',
      503
    );
  }

  const client = createPublicClient({
    chain,
    transport: http(url),
  });

  let receipt: Awaited<ReturnType<typeof client.waitForTransactionReceipt>>;
  try {
    receipt = await client.waitForTransactionReceipt({
      hash: params.txHash,
      pollingInterval: 2_000,
      timeout: RECEIPT_WAIT_MS,
    });
  } catch (e) {
    if (e instanceof WaitForTransactionReceiptTimeoutError) {
      throw new AnchorTxValidationError(
        'Transaction receipt not found yet; please retry in a few seconds',
        400
      );
    }
    throw new AnchorTxValidationError(
      e instanceof Error ? e.message : 'Failed to fetch transaction receipt from RPC',
      503
    );
  }
  if (receipt.status !== 'success') {
    throw new AnchorTxValidationError('Transaction reverted on-chain', 400);
  }
  if (!receipt.to || receipt.to.toLowerCase() !== params.contractAddress.toLowerCase()) {
    throw new AnchorTxValidationError('Transaction target does not match MemoryRegistry', 400);
  }
  const hasContractLog = receipt.logs.some(
    (log) => log.address.toLowerCase() === params.contractAddress.toLowerCase()
  );
  if (!hasContractLog) {
    throw new AnchorTxValidationError('No MemoryRegistry logs found in transaction receipt', 400);
  }
}
