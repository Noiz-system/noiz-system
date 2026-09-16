import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";
import { collectionRevalidation } from "@/cms/hooks/revalidate";

/**
 * News cards in section 05. The three most recent by `publishedAt` are shown.
 *
 * There is no article page yet, so a post is a headline, a teaser and an
 * optional link out; the card links to the news section when `link` is empty.
 */
export const Posts: CollectionConfig = {
  slug: "posts",
  access: publicRead,
  hooks: collectionRevalidation,
  defaultSort: "-publishedAt",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt"],
    group: { en: "Content", fr: "Contenu" },
  },
  labels: {
    singular: { en: "Post", fr: "Article" },
    plural: { en: "Posts", fr: "Articles" },
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "link",
      type: "text",
      admin: {
        description: {
          en: "Optional URL the card opens. Leave empty to keep it on the page.",
          fr: "URL optionnelle ouverte par la carte. Laissez vide pour rester sur la page.",
        },
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "company",
      options: [
        { value: "product", label: { en: "Product", fr: "Produit" } },
        { value: "logistics", label: { en: "Logistics", fr: "Logistique" } },
        { value: "company", label: { en: "Company", fr: "Entreprise" } },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayOnly" },
      },
    },
  ],
};
