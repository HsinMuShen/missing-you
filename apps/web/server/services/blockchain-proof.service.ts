import type { Journal } from '@missing-you/shared';
import type { ChainVerificationResult } from '@missing-you/shared';
import { normalizeHashHex } from '@/lib/hashing';
import { getServerRpcUrl } from '@/lib/blockchain/rpc-urls';
import { readMemoryRecord } from '@/lib/blockchain/memory-registry';
import type { Hex } from 'viem';

/**
 * Compares PostgreSQL anchor metadata with `MemoryRegistry` state.
 * Depends on the same canonical JSON + SHA-256 rules as anchoring, and the same UUID→bytes32 mapping.
 */
export async function getJournalChainVerification(journal: Journal): Promise<ChainVerificationResult> {
  if (!journal.anchor) {
    return { state: 'skipped_no_anchor' };
  }

  const { chainId, contractAddress, contentHash, memoryId } = journal.anchor;
  if (!memoryId || chainId == null || !contractAddress) {
    return { state: 'skipped_no_metadata', message: 'Missing chainId or contractAddress on anchor row' };
  }

  const rpc = getServerRpcUrl(chainId);
  if (!rpc) {
    return { state: 'skipped_no_rpc', message: 'Server RPC not configured for this chain' };
  }

  try {
    const record = await readMemoryRecord({
      chainId,
      contractAddress: contractAddress as Hex,
      memoryUuid: memoryId,
      rpcUrl: rpc,
    });

    const onChainHash = record.contentHash as string;
    const dbHash = contentHash;

    if (normalizeHashHex(onChainHash) !== normalizeHashHex(dbHash)) {
      return {
        state: 'hash_mismatch',
        message: 'On-chain contentHash differs from database',
        onChainContentHash: onChainHash,
      };
    }

    return {
      state: 'verified',
      onChainOwner: record.owner,
      onChainContentHash: onChainHash,
      onChainAnchoredAt: Number(record.anchoredAt),
    };
  } catch {
    return {
      state: 'missing_on_chain',
      message: 'No registry record (reverted or wrong network/address)',
    };
  }
}
