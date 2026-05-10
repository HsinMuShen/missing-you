# Blockchain (MemoryRegistry)

- **`rpc-urls.ts`** — server-only JSON-RPC URLs for receipt checks and `getMemory` reads (`POLYGON_AMOY_RPC_URL`, `POLYGON_MAINNET_RPC_URL`).
- **`validate-anchor-tx.ts`** — waits for an on-chain receipt via `waitForTransactionReceipt` (default **120s**, override with `ANCHOR_RECEIPT_WAIT_MS`). Public RPCs can lag MetaMask by many seconds.
- **`memory-registry.ts`** — typed `readContract` helpers for `MemoryRegistry`.
- **`client.ts`** — optional factory for read clients.

Canonical JSON + SHA-256 hashing stays in `lib/hashing/`; the contract stores the resulting `bytes32` only.
