# `@missing-you/contracts`

Foundry project for **MemoryRegistry** — on-chain proof metadata only; journal bodies stay off-chain.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Install libraries

```bash
cd packages/contracts
forge install foundry-rs/forge-std
forge install OpenZeppelin/openzeppelin-contracts@v5.1.0
```

See `lib/README.md` for remapped paths.

## Compile

```bash
forge build
# or
pnpm compile
```

## Test

```bash
forge test
```

## Deploy

Set required env first:

- `PRIVATE_KEY` (deployer wallet private key; never commit)
- `POLYGON_AMOY_RPC_URL` for testnet
- `POLYGON_RPC_URL` for Polygon mainnet

### Amoy (testnet)

```bash
pnpm deploy:amoy
DEPLOY_NETWORK=amoy DEPLOY_CHAIN_ID=80002 pnpm save:deployment
```

### Polygon mainnet

```bash
pnpm deploy:polygon
DEPLOY_NETWORK=polygon DEPLOY_CHAIN_ID=137 pnpm save:deployment
```

Both commands broadcast `script/Deploy.s.sol` and save deployment metadata to:

- `deployments/MemoryRegistry.amoy.json`
- `deployments/MemoryRegistry.polygon.json`

### ABI export

After compile/deploy:

```bash
pnpm compile
pnpm export:abi
```

ABI file is exported to `deployments/MemoryRegistry.abi.json`.

### Update web app config

After deployment, set:

- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` (or `NEXT_PUBLIC_CONTRACT_ADDRESS`)
- `NEXT_PUBLIC_ANCHOR_CHAIN_ID` (or `NEXT_PUBLIC_CHAIN_ID`)
- RPC URLs in `apps/web/.env.local` (or deployment platform env)

The **web app** (`apps/web`) owns all **journal text**, auth, optional **anchor** orchestration (prepare → wallet tx → confirm), **verification** UI, **i18n**, **rate limiting** on sensitive APIs, and user-facing **loading** states. This Foundry package only needs to stay aligned on **ABI**, **bytecode**, and **deployed addresses**; product copy and UX live outside this folder.

## Layout

- `src/MemoryRegistry.sol` — `Ownable` + `Pausable` (OpenZeppelin), `anchorMemory`, `getMemory`, `verifyMemory`, `setShareable`
- `script/Deploy.s.sol` — deploy entrypoint (`owner` = deployer)
- `test/MemoryRegistry.t.sol` — unit tests
- `scripts/export-abi.mjs` — export ABI for infra/frontend consumption
- `scripts/save-deployment.mjs` — persist deployed address/chain metadata
