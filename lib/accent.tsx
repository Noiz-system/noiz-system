import type { ReactNode } from "react";

const ACCENT = /<accent>(.*?)<\/accent>/g;

/**
 * Renders CMS text that uses `<accent>…</accent>` to mark words for the brand
 * gradient (see `cms/fields/accent.ts`). Anything else is plain text; there is
 * no HTML parsing, so editors cannot inject markup.
 */
export function renderAccented(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(ACCENT)) {
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      <span key={start} className="brand-text">
        {match[1]}
      </span>,
    );
    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}
