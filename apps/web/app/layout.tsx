import type { ReactNode } from 'react';

/**
 * Root shell — locale-specific `<html lang>` lives in `app/[locale]/layout.tsx` per next-intl guidance.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
