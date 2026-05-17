import { MarkdownDocumentClient } from '@/components/docs/markdown-document.client';

type Props = {
  content: string;
};

/** Server-safe entry: renders markdown in a client boundary (Mermaid + ASCII figures). */
export function MarkdownDocument({ content }: Props) {
  return <MarkdownDocumentClient content={content} />;
}
