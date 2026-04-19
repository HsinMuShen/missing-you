# `@missing-you/contracts`

Foundry project for **MemoryRegistry** — on-chain proof metadata only; journal bodies stay off-chain.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Install dependencies

```bash
cd packages/contracts
forge install --no-commit foundry-rs/forge-std
```

> If `forge install` warns about git, ensure this package is inside a git repository or use `forge install` with appropriate flags.

## Compile

```bash
forge build
# or from this directory:
pnpm compile
```

## Test

```bash
forge test
```

## Deploy (example)

Set `SEPOLIA_RPC_URL` and a deployer key, then:

```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --broadcast
```

Record the deployed address in your app environment (see root README).

## Layout

- `src/MemoryRegistry.sol` — registry contract
- `script/Deploy.s.sol` — deployment entrypoint
- `test/MemoryRegistry.t.sol` — unit tests
