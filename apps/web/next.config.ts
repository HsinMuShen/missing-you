import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

/**
 * next-intl request config resolves messages per locale.
 */
const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /** Compile workspace packages from source in the Next.js bundle. */
  transpilePackages: ['@missing-you/shared', '@missing-you/ui'],
  outputFileTracingRoot: path.join(__dirname, '../..'),
  webpack: (config) => {
    // Optional deps pulled by MetaMask SDK / WalletConnect / pino — not used in the web bundle.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
