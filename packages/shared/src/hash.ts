/**
 * Hashing is implemented in the BFF (`apps/web/lib/hashing/hash.ts`) using Node `crypto` SHA-256.
 *
 * When you integrate `MemoryRegistry`, pass the 32-byte digest as `bytes32` (same 32 bytes as SHA-256).
 * On-chain verification must use the same canonical JSON string → UTF-8 bytes → SHA-256 pipeline
 * (Solidity `sha256(bytes)` on the identical byte sequence) for `verifyMemory` to agree with this app.
 */
export type ContentHashHex = `0x${string}`;
