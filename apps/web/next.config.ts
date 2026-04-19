import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * next-intl request config resolves messages per locale.
 */
const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /** Compile workspace packages from source in the Next.js bundle. */
  transpilePackages: ['@missing-you/shared', '@missing-you/ui'],
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
