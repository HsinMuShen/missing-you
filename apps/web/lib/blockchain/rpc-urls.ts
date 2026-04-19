/**
 * Server-side JSON-RPC URLs for reading receipts and registry state.
 * Never expose private keys here — wallet signing stays in the browser.
 */
export function getServerRpcUrl(chainId: number): string | undefined {
  switch (chainId) {
    case 80002:
      return process.env.POLYGON_AMOY_RPC_URL;
    case 137:
      return process.env.POLYGON_MAINNET_RPC_URL;
    default:
      return undefined;
  }
}
