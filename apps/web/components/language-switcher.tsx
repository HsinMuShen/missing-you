'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@missing-you/shared';
import { Spinner } from '@/components/ui/spinner';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">Language</span>
      {pending ? <Spinner size="sm" className="text-foreground" /> : null}
      <select
        className="min-h-9 rounded-full border border-border bg-card px-3 py-1.5 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:opacity-60"
        value={locale}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as Locale;
          startTransition(() => {
            router.replace(pathname, { locale: next });
          });
        }}
        aria-label="Language"
        aria-busy={pending}
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
