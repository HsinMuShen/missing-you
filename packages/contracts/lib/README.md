# Foundry libraries

Install before `forge build` / `forge test`:

```bash
cd packages/contracts
forge install --no-commit foundry-rs/forge-std
forge install --no-commit OpenZeppelin/openzeppelin-contracts@v5.1.0
```

This creates `lib/forge-std` and `lib/openzeppelin-contracts` used by remappings in `foundry.toml`.
