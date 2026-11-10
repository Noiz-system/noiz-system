import type { ReactNode } from "react";

/**
 * `<accent>…</accent>` marks words for the brand gradient; `<br>` forces a
 * line break; `<br-md>` breaks only from the `md` breakpoint up.
 */
const TOKENS = /<accent>(.*?)<\/accent>|<br-md>|<br>/g;

/**
 * Renders CMS headline text that uses the markup above (see
 * `cms/fields/accent.ts`). Anything else is plain text; there is no HTML
 * parsing, so editors cannot inject markup.
 */
export function renderAccented(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(TOKENS)) {
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));

    if (match[0] === "<br>") {
      parts.push(<br key={start} />);
    } else if (match[0] === "<br-md>") {
      parts.push(<br key={start} className="hidden md:block" />);
    } else {
      parts.push(
        <span key={start} className="text-move">
          {match[1]}
        </span>,
      );
    }

    cursor = start + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

/** The same text with the markup stripped, for metadata and alt text. */
export function plainAccented(text: string): string {
  return text
    .replace(/<br(-md)?>/g, " ")
    .replace(/<\/?accent>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
