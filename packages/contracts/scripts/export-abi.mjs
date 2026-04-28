#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const artifactPath = path.join(root, 'out', 'MemoryRegistry.sol', 'MemoryRegistry.json');
const outputPath = path.join(root, 'deployments', 'MemoryRegistry.abi.json');

if (!fs.existsSync(artifactPath)) {
  console.error('[contracts] Missing artifact. Run `forge build` first.');
  process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
if (!artifact.abi) {
  console.error('[contracts] ABI not found in artifact.');
  process.exit(1);
}

fs.writeFileSync(outputPath, `${JSON.stringify(artifact.abi, null, 2)}\n`);
console.log(`[contracts] ABI exported to ${outputPath}`);
