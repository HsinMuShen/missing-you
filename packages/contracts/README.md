# `@missing-you/contracts`

Foundry project for **MemoryRegistry** — on-chain proof metadata only; journal bodies stay off-chain.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Install libraries

```bash
cd packages/contracts
forge install --no-commit foundry-rs/forge-std
forge install --no-commit OpenZeppelin/openzeppelin-contracts@v5.1.0
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

## Deploy (Polygon Amoy example)

Set `POLYGON_AMOY_RPC_URL`, then:

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $POLYGON_AMOY_RPC_URL --broadcast
```

Record the deployed address in `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` for the web app.

## Layout

- `src/MemoryRegistry.sol` — `Ownable` + `Pausable` (OpenZeppelin), `anchorMemory`, `getMemory`, `verifyMemory`, `setShareable`
- `script/Deploy.s.sol` — deploy entrypoint (`owner` = deployer)
- `test/MemoryRegistry.t.sol` — unit tests
