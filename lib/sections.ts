/**
 * Anchor ids for the landing page's scroll sections.
 *
 * Shared so the header, the side rail and the sections themselves can never
 * drift apart into a dead anchor link.
 */
export const SECTION_IDS = {
  products: "products",
  capabilities: "capabilities",
  method: "method",
  markets: "markets",
  news: "news",
  faq: "faq",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/** Order used by the side rail, top to bottom. */
export const RAIL_SECTIONS = [
  SECTION_IDS.products,
  SECTION_IDS.capabilities,
  SECTION_IDS.method,
  SECTION_IDS.markets,
  SECTION_IDS.news,
  SECTION_IDS.faq,
  SECTION_IDS.contact,
] as const;

/** Two-digit label printed before a section title, e.g. "01". */
export function sectionIndex(id: SectionId): string {
  return String(RAIL_SECTIONS.indexOf(id) + 1).padStart(2, "0");
}
