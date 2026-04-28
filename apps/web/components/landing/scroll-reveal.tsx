'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function ScrollReveal({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`scroll-reveal ${visible ? 'scroll-reveal-visible' : ''}`}
    >
      {children}
    </div>
  );
}
