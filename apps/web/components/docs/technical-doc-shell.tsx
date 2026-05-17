import type { ReactNode } from 'react';
import { Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';

const PRODUCTION_SITE_ORIGIN = 'https://missing-you.hsinmushen.com';

type Props = {
  backLabel: string;
  liveSiteLabel: string;
  liveSiteAria: string;
  liveSiteHref: string;
  children: ReactNode;
};

export function TechnicalDocShell({
  backLabel,
  liveSiteLabel,
  liveSiteAria,
  liveSiteHref,
  children,
}: Props) {
  return (
    <Container className="py-14 sm:py-20">
      <nav className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="Documentation">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&lt;</span>
          <span>{backLabel}</span>
        </Link>
        <span className="hidden text-border sm:inline" aria-hidden="true">
          |
        </span>
        <a
          href={liveSiteHref}
          className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={liveSiteAria}
        >
          {liveSiteLabel}
          <span className="text-foreground/80"> — {PRODUCTION_SITE_ORIGIN.replace(/^https:\/\//, '')}</span>
        </a>
      </nav>
      <article className="max-w-5xl space-y-4 [&_h1+p]:mt-6 [&_pre]:max-w-none">{children}</article>
    </Container>
  );
}
