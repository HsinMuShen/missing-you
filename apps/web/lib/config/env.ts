import { z } from 'zod';

const optionalUrl = z.string().url().optional();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(1).optional(),
  AUTH_URL: optionalUrl,
  AUTH_EMAIL_SERVER: z.string().min(1).optional(),
  AUTH_EMAIL_FROM: z.string().min(1).optional(),
  SENTRY_DSN: optionalUrl,

  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_CHAIN_ID: z.enum(['137', '80002']).optional(),
  NEXT_PUBLIC_ANCHOR_CHAIN_ID: z.enum(['137', '80002']).optional(),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_POLYGON_AMOY_RPC_URL: optionalUrl,
  NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL: optionalUrl,

  RPC_URL: optionalUrl,
  POLYGON_AMOY_RPC_URL: optionalUrl,
  POLYGON_MAINNET_RPC_URL: optionalUrl,

  NEXT_PUBLIC_EXPLORER_BASE_URL: optionalUrl,
  NEXT_PUBLIC_POLYGON_AMOY_EXPLORER_BASE_URL: optionalUrl,
  NEXT_PUBLIC_POLYGON_MAINNET_EXPLORER_BASE_URL: optionalUrl,
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const env = parsed.data;

export function isProduction() {
  return env.NODE_ENV === 'production';
}

export function getPublicAppUrl() {
  return env.NEXT_PUBLIC_APP_URL ?? env.AUTH_URL ?? 'http://localhost:3000';
}

export function getExplorerBaseUrl(chainId: number): string | undefined {
  if (env.NEXT_PUBLIC_EXPLORER_BASE_URL) {
    return env.NEXT_PUBLIC_EXPLORER_BASE_URL;
  }
  if (chainId === 137) {
    return env.NEXT_PUBLIC_POLYGON_MAINNET_EXPLORER_BASE_URL ?? 'https://polygonscan.com';
  }
  if (chainId === 80002) {
    return env.NEXT_PUBLIC_POLYGON_AMOY_EXPLORER_BASE_URL ?? 'https://amoy.polygonscan.com';
  }
  return undefined;
}

export function getServerRpcUrlByChainId(chainId: number): string | undefined {
  if (env.RPC_URL) return env.RPC_URL;
  if (chainId === 137) return env.POLYGON_MAINNET_RPC_URL;
  if (chainId === 80002) return env.POLYGON_AMOY_RPC_URL;
  return undefined;
}

export function getAnchorChainIdFromEnv(): number {
  const raw = env.NEXT_PUBLIC_ANCHOR_CHAIN_ID ?? env.NEXT_PUBLIC_CHAIN_ID ?? '80002';
  return Number(raw);
}

export function getMemoryRegistryAddressFromEnv(): string | undefined {
  return env.NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS ?? env.NEXT_PUBLIC_CONTRACT_ADDRESS;
}

export function getMissingRequiredEnvForDeployment(): string[] {
  const missing: string[] = [];
  if (!env.DATABASE_URL) missing.push('DATABASE_URL');
  if (!env.AUTH_SECRET) missing.push('AUTH_SECRET');
  if (!env.AUTH_URL) missing.push('AUTH_URL');
  if (!getMemoryRegistryAddressFromEnv()) {
    missing.push('NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS (or NEXT_PUBLIC_CONTRACT_ADDRESS)');
  }

  const chain = getAnchorChainIdFromEnv();
  if (chain === 137 && !getServerRpcUrlByChainId(137)) missing.push('POLYGON_MAINNET_RPC_URL (or RPC_URL)');
  if (chain === 80002 && !getServerRpcUrlByChainId(80002)) {
    missing.push('POLYGON_AMOY_RPC_URL (or RPC_URL)');
  }

  return missing;
}

export { env };
