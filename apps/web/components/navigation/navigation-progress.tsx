'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Thin top bar when the URL changes (locale routes). Pairs with `app/[locale]/loading.tsx` for RSC transitions.
 */
function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const keyRef = useRef<string | null>(null);

  useEffect(() => {
    const search = searchParams.toString();
    const key = search ? `${pathname}?${search}` : pathname;
    if (keyRef.current === null) {
      keyRef.current = key;
      return;
    }
    if (keyRef.current === key) return;
    keyRef.current = key;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 450);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-1 overflow-hidden bg-muted/80"
      aria-hidden
    >
      <div className="h-full w-2/5 animate-nav-progress bg-foreground/55" />
    </div>
  );
}

export function NavigationProgress() {
  return <NavigationProgressInner />;
}
