'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function WriteTrustPanel() {
  const t = useTranslations('journals.writeTrust');
  const [open, setOpen] = useState(false);
  const rawBullets = t.raw('bullets') as string[];
  const bullets = Array.isArray(rawBullets) ? rawBullets : [];

  return (
    <div className="mt-6 rounded-lg border border-border/80 bg-muted/30 px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left text-sm font-medium text-foreground min-h-11 sm:min-h-0"
        aria-expanded={open}
      >
        <span>{t('toggleLabel')}</span>
        <span className="text-muted-foreground" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open ? (
        <div className="mt-3 space-y-2 border-t border-border/60 pt-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{t('lead')}</p>
          <ul className="list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-foreground">
            {bullets.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">{t('footer')}</p>
        </div>
      ) : null}
    </div>
  );
}
