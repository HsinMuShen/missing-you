import { createHash } from 'node:crypto';

/**
 * SHA-256 over UTF-8 bytes of the canonical JSON string.
 *
 * Deterministic: same string → same digest. Used for off-chain verification and (after integration)
 * must match whatever the chain checks (e.g. `sha256` precompile on identical ABI-encoded bytes).
 *
 * Returns lowercase hex with `0x` prefix (64 hex chars) so it maps cleanly to `bytes32` in Solidity.
 */
export function generateHash(payload: string): string {
  const digest = createHash('sha256').update(payload, 'utf8').digest('hex');
  return `0x${digest}`;
}

/** Normalize hex for comparisons (accepts with or without 0x). */
export function normalizeHashHex(h: string): string {
  const s = h.startsWith('0x') || h.startsWith('0X') ? h.slice(2) : h;
  return s.toLowerCase();
}
