import type { NumberField } from "payload";

/**
 * Explicit sort position for the small, hand-ordered collections (products,
 * FAQs, markets). Lower comes first.
 *
 * Payload's `orderable` drag-and-drop option would be nicer to use, but it is
 * flagged experimental with breaking changes expected; a plain number is
 * boring and stable.
 */
export const orderField: NumberField = {
  name: "order",
  type: "number",
  required: true,
  defaultValue: 0,
  admin: {
    position: "sidebar",
    description: {
      en: "Lower numbers are shown first.",
      fr: "Les plus petits nombres s’affichent en premier.",
    },
  },
};
