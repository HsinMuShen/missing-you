import type { Locale } from './types.js';

export const APP_NAME = 'Missing You';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'zh-TW'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Human-readable labels for locale switcher (not for i18n message keys).
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
};

/**
 * App routes (path segments after locale prefix).
 */
export const ROUTES = {
  home: '/',
  write: '/write',
  memories: '/memories',
  memory: (id: string) => `/memory/${id}` as const,
  settings: '/settings',
} as const;

/**
 * Placeholder chain config for wagmi / future anchoring.
 * Replace with env-driven values per deployment.
 */
export const CHAIN_CONFIG_PLACEHOLDER = {
  /** Example: Ethereum Sepolia testnet — update for your target chain */
  defaultChainId: 11155111,
  /** MemoryRegistry address after deploy; empty until deployed */
  memoryRegistryAddress: '' as `0x${string}` | '',
} as const;
