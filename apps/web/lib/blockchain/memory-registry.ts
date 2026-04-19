import { createPublicClient, http, type Address, type Hex } from 'viem';
import { getAnchorChainById, journalUuidToMemoryIdKey, memoryRegistryAbi } from '@missing-you/shared';
import type { Chain } from 'viem';

export type OnChainMemoryRecord = {
  memoryId: Hex;
  contentHash: Hex;
  owner: Address;
  anchoredAt: bigint;
  shareable: boolean;
};

function clientFor(chain: Chain, rpcUrl: string) {
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
}

export async function readMemoryRecord(params: {
  chainId: number;
  contractAddress: Address;
  memoryUuid: string;
  rpcUrl: string;
}): Promise<OnChainMemoryRecord> {
  const chain = getAnchorChainById(params.chainId);
  if (!chain) {
    throw new Error('Unsupported chain');
  }
  const client = clientFor(chain, params.rpcUrl);
  const memoryKey = journalUuidToMemoryIdKey(params.memoryUuid);
  const record = await client.readContract({
    address: params.contractAddress,
    abi: memoryRegistryAbi,
    functionName: 'getMemory',
    args: [memoryKey],
  });
  return record as OnChainMemoryRecord;
}

export async function readVerifyMemory(params: {
  chainId: number;
  contractAddress: Address;
  memoryUuid: string;
  contentHash: Hex;
  rpcUrl: string;
}): Promise<boolean> {
  const chain = getAnchorChainById(params.chainId);
  if (!chain) {
    throw new Error('Unsupported chain');
  }
  const client = clientFor(chain, params.rpcUrl);
  const memoryKey = journalUuidToMemoryIdKey(params.memoryUuid);
  return client.readContract({
    address: params.contractAddress,
    abi: memoryRegistryAbi,
    functionName: 'verifyMemory',
    args: [memoryKey, params.contentHash],
  });
}
