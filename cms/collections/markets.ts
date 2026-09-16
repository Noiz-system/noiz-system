import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";
import { orderField } from "@/cms/fields/order";
import { collectionRevalidation } from "@/cms/hooks/revalidate";

/**
 * Rows of the markets table in section 04.
 *
 * Which products run in a market is a relationship, not a string, so renaming
 * a product renames it everywhere. Status is a business fact and is not
 * localized — only its label is, on the frontend.
 */
export const Markets: CollectionConfig = {
  slug: "markets",
  access: publicRead,
  hooks: collectionRevalidation,
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "order"],
    group: { en: "Content", fr: "Contenu" },
  },
  labels: {
    singular: { en: "Market", fr: "Marché" },
    plural: { en: "Markets", fr: "Marchés" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      required: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "study",
      options: [
        { value: "live", label: { en: "Live", fr: "En ligne" } },
        { value: "next", label: { en: "Next", fr: "À venir" } },
        { value: "study", label: { en: "Under study", fr: "À l’étude" } },
      ],
      admin: { position: "sidebar" },
    },
    orderField,
  ],
};
