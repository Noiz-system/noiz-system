import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";
import { orderField } from "@/cms/fields/order";
import { collectionRevalidation } from "@/cms/hooks/revalidate";

/**
 * The product cards in section 01.
 *
 * `name` is a brand and stays the same in every language; everything else a
 * reader sees is localized.
 */
export const Products: CollectionConfig = {
  slug: "products",
  access: publicRead,
  hooks: collectionRevalidation,
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "order"],
    group: { en: "Content", fr: "Contenu" },
  },
  labels: {
    singular: { en: "Product", fr: "Produit" },
    plural: { en: "Products", fr: "Produits" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: {
          en: "Brand name, shown as-is in every language.",
          fr: "Nom de marque, affiché tel quel dans toutes les langues.",
        },
      },
    },
    {
      name: "status",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description: {
          en: "Short availability line, e.g. “Live · iOS & Android”.",
          fr: "Ligne de disponibilité courte, ex. « En ligne · iOS & Android ».",
        },
      },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "body",
      type: "textarea",
      localized: true,
      required: true,
    },
    {
      name: "bullets",
      type: "array",
      minRows: 1,
      maxRows: 5,
      labels: {
        singular: { en: "Bullet", fr: "Point" },
        plural: { en: "Bullets", fr: "Points" },
      },
      fields: [
        {
          name: "text",
          type: "text",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: {
          en: "Optional. A hatched placeholder is shown until an image is set.",
          fr: "Optionnel. Un motif hachuré s’affiche tant qu’aucune image n’est définie.",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "cta",
          type: "text",
          localized: true,
          required: true,
          label: { en: "Button label", fr: "Libellé du bouton" },
        },
        {
          name: "ctaHref",
          type: "text",
          label: { en: "Button link", fr: "Lien du bouton" },
          admin: {
            description: {
              en: "Leave empty to scroll to the contact form.",
              fr: "Laissez vide pour renvoyer vers le formulaire de contact.",
            },
          },
        },
      ],
    },
    orderField,
  ],
};
