import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";
import { orderField } from "@/cms/fields/order";
import { collectionRevalidation } from "@/cms/hooks/revalidate";

/** Shown under both store-link fields. */
const STORE_LINK_DESCRIPTION = {
  en: "Optional. Once a store link is set, the card shows download buttons instead of the button above.",
  fr: "Optionnel. Dès qu’un lien de store est renseigné, la carte affiche des boutons de téléchargement à la place du bouton ci-dessus.",
};

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
          en: "Optional. Square product icon shown next to the name and on the help center.",
          fr: "Optionnel. Icône carrée du produit, affichée à côté du nom et dans le centre d’aide.",
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
    {
      type: "row",
      fields: [
        {
          name: "appStoreUrl",
          type: "text",
          label: { en: "App Store link", fr: "Lien App Store" },
          admin: { description: STORE_LINK_DESCRIPTION },
        },
        {
          name: "playStoreUrl",
          type: "text",
          label: { en: "Google Play link", fr: "Lien Google Play" },
          admin: { description: STORE_LINK_DESCRIPTION },
        },
      ],
    },
    orderField,
  ],
};
