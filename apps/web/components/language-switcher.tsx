'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@missing-you/shared';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">Language</span>
      <select
        className="rounded-full border border-border bg-card px-3 py-1.5 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          router.replace(pathname, { locale: next });
        }}
        aria-label="Language"
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
