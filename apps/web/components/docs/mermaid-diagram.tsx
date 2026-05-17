'use client';

import { applyMermaidTheme, postProcessMermaidSvg } from '@/lib/docs/mermaid-theme';
import { useEffect, useId, useState } from 'react';

type Props = {
  chart: string;
};

function prefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function MermaidDiagram({ chart }: Props) {
  const diagramId = useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const mermaid = (await import('mermaid')).default;
      const isDark = prefersDark();

      applyMermaidTheme(mermaid, isDark);

      try {
        const { svg: raw } = await mermaid.render(`mmd-${diagramId}`, chart);
        const rendered = postProcessMermaidSvg(raw, isDark);
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Diagram could not be rendered');
        }
      }
    };

    setSvg(null);
    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, diagramId, dark]);

  if (error) {
    return (
      <div className="my-6 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-foreground">Could not render diagram</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-diagram my-6 overflow-x-auto rounded-lg border border-border bg-card p-4 shadow-sm [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      role="img"
      aria-label="Architecture diagram"
    >
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">Loading diagram…</p>
      )}
    </div>
  );
}
