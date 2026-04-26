export function getTxExplorerUrl(chainId: number | null | undefined, txHash: string): string | null {
  if (!chainId || !txHash) return null;
  if (chainId === 137) return `https://polygonscan.com/tx/${txHash}`;
  if (chainId === 80002) return `https://amoy.polygonscan.com/tx/${txHash}`;
  return null;
}
