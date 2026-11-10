/**
 * Anchor ids for the home page's scroll sections.
 *
 * Shared so the header, the footer and the sections themselves can never
 * drift apart into a dead anchor link. The ids are the French slugs the
 * reference design uses (`/#produits`, `/#methode`…).
 */
export const SECTION_IDS = {
  products: "produits",
  method: "methode",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Page order, top to bottom; drives the two-digit section index. */
export const SECTION_ORDER = [
  SECTION_IDS.products,
  SECTION_IDS.method,
  SECTION_IDS.faq,
  SECTION_IDS.contact,
] as const;

/** Two-digit label printed above a section title, e.g. "01". */
export function sectionIndex(id: SectionId): string {
  return String(SECTION_ORDER.indexOf(id) + 1).padStart(2, "0");
}

/** Anchors on the home page, as next-intl `<Link>` hrefs. */
export function homeAnchor(id: SectionId) {
  return { pathname: "/", hash: id } as const;
}

/** Anchors on the support page. */
export const SUPPORT_ANCHORS = {
  request: "demande",
  tracking: "suivi",
} as const;
