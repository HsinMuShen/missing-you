'use client';

import dynamic from 'next/dynamic';
import { Children, isValidElement, type ReactNode } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from '@/lib/i18n/navigation';

const MermaidDiagram = dynamic(
  () => import('@/components/docs/mermaid-diagram').then((mod) => mod.MermaidDiagram),
  {
    ssr: false,
    loading: () => (
      <div className="my-6 overflow-x-auto rounded-lg border border-border bg-card/80 p-4">
        <p className="py-6 text-center text-sm text-muted-foreground">Loading diagram…</p>
      </div>
    ),
  },
);

function nodeText(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(nodeText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return nodeText(children.props.children);
  }
  return '';
}

function isMermaidPre(children: ReactNode): string | null {
  const child = Children.toArray(children)[0];
  if (!isValidElement<{ className?: string; children?: ReactNode }>(child)) {
    return null;
  }
  if (!child.props.className?.includes('language-mermaid')) {
    return null;
  }
  return nodeText(child.props.children).trim();
}

const asciiPreClassName =
  'ascii-diagram my-6 max-w-none overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-[11px] leading-[1.2] whitespace-pre text-foreground [tab-size:2]';

const asciiCodeClassName =
  'block min-w-min bg-transparent p-0 font-inherit text-inherit leading-inherit whitespace-pre';

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 font-display text-xl font-medium text-foreground first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="mt-8 text-lg font-medium text-foreground">{children}</h3>,
  p: ({ children }) => <p className="leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => {
    const className = 'text-foreground underline underline-offset-4 hover:text-foreground/80';
    if (href?.startsWith('http')) {
      return (
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[28rem] border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border bg-muted/30">{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-medium text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border px-3 py-2 align-top text-muted-foreground">{children}</td>
  ),
  pre: ({ children }) => {
    const chart = isMermaidPre(children);
    if (chart) {
      return <MermaidDiagram chart={chart} />;
    }
    return <pre className={asciiPreClassName}>{children}</pre>;
  },
  code: ({ className, children }) => {
    if (className?.includes('language-mermaid')) {
      return <>{children}</>;
    }
    if (className) {
      return <code className={asciiCodeClassName}>{children}</code>;
    }
    return (
      <code className="rounded bg-muted/60 px-1 py-0.5 font-mono text-sm text-foreground">
        {children}
      </code>
    );
  },
  hr: () => <hr className="my-10 border-border" />,
  strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
};

type Props = {
  content: string;
};

export function MarkdownDocumentClient({ content }: Props) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
