# Services

Domain logic that sits above repositories.

- **`journal.service.ts`** — Zod validation, default user resolution, canonical payload + hash orchestration, prepare/confirm anchor flows, DTO mapping.
- **`verification.service.ts`** — Recompute digest from stored journal fields and compare to `MemoryAnchor.contentHash`; `verifyJournalDto` for API-shaped data.
- **`api-error.ts`** — Map `JournalServiceError` to JSON responses in route handlers.
