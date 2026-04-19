import { keccak256, stringToBytes, type Hex } from 'viem';

/**
 * Maps the off-chain UUID (`Journal.memoryId`) to the on-chain `bytes32` key used in `MemoryRegistry`.
 * Must stay identical between BFF, client tx submission, and verification reads.
 */
export function journalUuidToMemoryIdKey(uuid: string): Hex {
  return keccak256(stringToBytes(uuid));
}
