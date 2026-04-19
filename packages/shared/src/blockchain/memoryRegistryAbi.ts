/**
 * ABI for `MemoryRegistry` — keep in sync with `packages/contracts/src/MemoryRegistry.sol`.
 * Regenerate after interface changes (e.g. `forge inspect MemoryRegistry abi`).
 */
export const memoryRegistryAbi = [
  {
    type: 'function',
    name: 'anchorMemory',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'memoryId', type: 'bytes32' },
      { name: 'contentHash', type: 'bytes32' },
      { name: 'shareable', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getMemory',
    stateMutability: 'view',
    inputs: [{ name: 'memoryId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'memoryId', type: 'bytes32' },
          { name: 'contentHash', type: 'bytes32' },
          { name: 'owner', type: 'address' },
          { name: 'anchoredAt', type: 'uint64' },
          { name: 'shareable', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'verifyMemory',
    stateMutability: 'view',
    inputs: [
      { name: 'memoryId', type: 'bytes32' },
      { name: 'contentHash', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'setShareable',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'memoryId', type: 'bytes32' },
      { name: 'shareable', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'pause',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'unpause',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'paused',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;
