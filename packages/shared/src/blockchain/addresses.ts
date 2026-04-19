import type { Address } from 'viem';

/**
 * Deployed `MemoryRegistry` for the active anchor chain.
 * Set in `.env.local` as `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` (inlined at build for Next.js).
 */
export function getMemoryRegistryAddress(): Address | undefined {
  const raw =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS : undefined;
  if (!raw || !raw.startsWith('0x') || raw.length !== 42) {
    return undefined;
  }
  return raw as Address;
}
