import type { TextField } from "payload";

/**
 * A plain text field whose value may carry `<accent>…</accent>` markup, which
 * the frontend renders with the brand gradient (see `lib/accent.tsx`).
 *
 * Kept as text rather than rich text on purpose: the only formatting a
 * headline needs is "which words glow", and a tag the editor can type is
 * easier to keep consistent across two languages than a toolbar button.
 */
export function accentedText(name: string, label?: TextField["label"]): TextField {
  return {
    name,
    type: "text",
    localized: true,
    required: true,
    ...(label ? { label } : {}),
    admin: {
      description: {
        en: "Wrap words in <accent>…</accent> to highlight them with the brand gradient.",
        fr: "Entourez des mots de <accent>…</accent> pour les mettre en avant avec le dégradé de la marque.",
      },
    },
  };
}
