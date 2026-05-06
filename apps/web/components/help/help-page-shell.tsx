import type { ReactNode } from 'react';
import { Container } from '@missing-you/ui';
import { Link } from '@/lib/i18n/navigation';

type Props = {
  title: string;
  backLabel: string;
  children: ReactNode;
};

export function HelpPageShell({ title, backLabel, children }: Props) {
  return (
    <Container className="py-14 sm:py-20">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">&lt;</span>
        <span>{backLabel}</span>
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">{title}</h1>
      <div className="mt-8 max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-foreground [&_h2]:first:mt-0 [&_a]:text-foreground [&_a]:underline-offset-4 hover:[&_a]:underline [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-6 [&_ol]:pl-5">
        {children}
      </div>
    </Container>
  );
}
