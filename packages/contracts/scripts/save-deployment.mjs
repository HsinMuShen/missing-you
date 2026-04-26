#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const network = process.env.DEPLOY_NETWORK || process.argv[2] || 'amoy';
const chainIdRaw = process.env.DEPLOY_CHAIN_ID || process.argv[3] || '80002';
const chainId = Number(chainIdRaw);

if (!Number.isInteger(chainId) || chainId <= 0) {
  console.error('[contracts] Invalid chain id. Provide DEPLOY_CHAIN_ID or arg #2.');
  process.exit(1);
}

function findAddressFromBroadcast() {
  const runPath = path.join(root, 'broadcast', 'Deploy.s.sol', String(chainId), 'run-latest.json');
  if (!fs.existsSync(runPath)) return null;
  const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
  const txs = Array.isArray(run.transactions) ? run.transactions : [];
  const deploymentTx = txs.find((tx) => tx.contractName === 'MemoryRegistry' && tx.contractAddress);
  return deploymentTx?.contractAddress ?? null;
}

const explicitAddress = process.env.MEMORY_REGISTRY_ADDRESS || process.argv[4] || null;
const address = explicitAddress ?? findAddressFromBroadcast();
if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
  console.error(
    '[contracts] Could not determine deployment address. Pass MEMORY_REGISTRY_ADDRESS or run forge broadcast first.'
  );
  process.exit(1);
}

const output = {
  network,
  chainId,
  address,
  updatedAt: new Date().toISOString(),
};

const outPath = path.join(root, 'deployments', `MemoryRegistry.${network}.json`);
fs.writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`[contracts] Deployment saved to ${outPath}`);
console.log(`[contracts] Set NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS=${address}`);
console.log(`[contracts] Set NEXT_PUBLIC_ANCHOR_CHAIN_ID=${chainId}`);
