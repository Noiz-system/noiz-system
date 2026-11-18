import type { GlobalConfig } from "payload";
import { publicRead } from "@/cms/access";
import { accentedText } from "@/cms/fields/accent";
import { revalidateGlobalAfterChange } from "@/cms/hooks/revalidate";

/**
 * The editorial copy of the help centre (`/support`): its header, the aside
 * next to the form and the page metadata.
 *
 * The form itself — labels, placeholders, validation errors, ticket statuses
 * and the verification emails — is UI microcopy tied to the code that
 * validates it, so it stays in `messages/*.json`.
 */
export const SupportPage: GlobalConfig = {
  slug: "support-page",
  label: { en: "Help centre", fr: "Centre d’aide" },
  access: { read: publicRead.read, update: publicRead.update },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  admin: {
    group: { en: "Content", fr: "Contenu" },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "hero",
          label: { en: "Header", fr: "En-tête" },
          fields: [
            {
              name: "kicker",
              type: "text",
              localized: true,
              required: true,
              label: { en: "Kicker", fr: "Surtitre" },
            },
            accentedText("title"),
            accentedText("intro", { en: "Introduction", fr: "Introduction" }),
            {
              name: "productTagline",
              type: "text",
              localized: true,
              required: true,
              label: { en: "Product tagline", fr: "Accroche du produit" },
              admin: {
                description: {
                  en: "Shown under the product name, next to its icon.",
                  fr: "Affichée sous le nom du produit, à côté de son icône.",
                },
              },
            },
          ],
        },
        {
          name: "aside",
          label: { en: "Aside", fr: "Encadré" },
          admin: {
            description: {
              en: "Shown under the ticket lookup, above the contact email.",
              fr: "Affiché sous le suivi de ticket, au-dessus de l’e-mail de contact.",
            },
          },
          fields: [
            { name: "title", type: "text", localized: true, required: true },
            { name: "body", type: "textarea", localized: true, required: true },
          ],
        },
        {
          name: "seo",
          label: "SEO",
          fields: [
            {
              name: "title",
              type: "text",
              localized: true,
              required: true,
              label: { en: "Browser title", fr: "Titre du navigateur" },
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
              required: true,
              label: { en: "Meta description", fr: "Meta description" },
            },
            {
              name: "ogDescription",
              type: "textarea",
              localized: true,
              required: true,
              label: {
                en: "Social share description",
                fr: "Description pour le partage social",
              },
            },
          ],
        },
      ],
    },
  ],
};
