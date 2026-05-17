import fs from 'node:fs/promises';
import path from 'node:path';

const MEDIUM_NOTES_MARKER = '**How to use this file on Medium**';

const DOC_CANDIDATES = [
  path.join(process.cwd(), 'content', 'technical-system-documentation.md'),
  path.join(process.cwd(), '..', '..', 'docs', 'technical-system-documentation-for-medium.md'),
  path.join(process.cwd(), '..', '..', 'docs', 'technical-system-documentation.md'),
];

function stripMediumPublishingNotes(markdown: string): string {
  if (!markdown.includes(MEDIUM_NOTES_MARKER)) {
    return markdown.replace('(Medium edition)', '').trim();
  }

  const start = markdown.indexOf(MEDIUM_NOTES_MARKER);
  const divider = markdown.indexOf('\n---\n', start);
  if (divider === -1) {
    return markdown;
  }

  const head = markdown.slice(0, start).replace('(Medium edition)', '').trimEnd();
  const tail = markdown.slice(divider + 5).trimStart();
  return `${head}\n\n${tail}`.trim();
}

export async function loadTechnicalSystemDocumentation(): Promise<string> {
  let lastError: unknown;

  for (const filePath of DOC_CANDIDATES) {
    try {
      const raw = await fs.readFile(filePath, 'utf8');
      return stripMediumPublishingNotes(raw);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error('Technical system documentation file not found', { cause: lastError });
}
