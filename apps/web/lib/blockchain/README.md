# Blockchain integration (future)

- Read/write helpers for `MemoryRegistry` using viem/wagmi.
- Contract address and chain id from environment variables per deployment.

Anchoring should be triggered from **Server Actions** or **Route Handlers** in `apps/web` so private keys or relayer credentials never ship to the browser (unless using a user-signed flow).
