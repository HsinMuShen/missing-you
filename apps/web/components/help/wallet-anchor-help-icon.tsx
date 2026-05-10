'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/lib/i18n/navigation';

type Props = {
  className?: string;
  /**
   * Use in the site menu wallet row: tooltip aligns to the trailing edge. The menu
   * keeps that row outside the scroll region so this layer is not clipped; width
   * follows viewport (not the menu column).
   */
  tooltipAlign?: 'center' | 'inline-end';
};

export function WalletAnchorHelpIcon({ className, tooltipAlign = 'center' }: Props) {
  const t = useTranslations('help');
  const label = t('walletGuide.helpIconTooltip');

  const tooltipPosition =
    tooltipAlign === 'inline-end'
      ? 'bottom-full end-0 mb-1.5 max-w-[min(22rem,calc(100vw-1.25rem))] translate-x-0 text-start'
      : 'bottom-full start-1/2 mb-1.5 max-w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 text-center';

  return (
    <span className={`group/tooltip relative inline-flex shrink-0 align-middle ${className ?? ''}`}>
      <Link
        href="/wallet-and-anchor"
        className="inline-flex items-center text-muted-foreground underline decoration-transparent underline-offset-2 transition-colors hover:text-foreground hover:decoration-muted-foreground/40 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={label}
        title={label}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 opacity-85"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-[100] w-max whitespace-normal rounded-md border border-border bg-card px-2.5 py-1.5 text-xs leading-snug text-foreground shadow-md opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 ${tooltipPosition}`}
      >
        {label}
      </span>
    </span>
  );
}
