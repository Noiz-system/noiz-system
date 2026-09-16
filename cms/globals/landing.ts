import type { Field, GlobalConfig } from "payload";
import { publicRead } from "@/cms/access";
import { accentedText } from "@/cms/fields/accent";
import { revalidateGlobalAfterChange } from "@/cms/hooks/revalidate";

/** Localized text pair used by every section heading. */
function sectionHeading(withLede: boolean): Field[] {
  return [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    ...(withLede
      ? [
          {
            name: "lede",
            type: "textarea",
            localized: true,
            required: true,
            label: { en: "Lede", fr: "Chapeau" },
          } satisfies Field,
        ]
      : []),
  ];
}

/**
 * Everything on the landing page that is not a list of its own (those are
 * collections) and not UI microcopy (that stays in `messages/*.json`).
 *
 * Arrays here are deliberately *not* localized themselves — only the text in
 * their rows is. That keeps the structure (how many stats, which icon goes
 * with which capability) identical across languages, with only the words
 * changing.
 */
export const Landing: GlobalConfig = {
  slug: "landing",
  label: { en: "Landing page", fr: "Page d’accueil" },
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
          label: { en: "Hero", fr: "En-tête" },
          fields: [
            {
              name: "kicker",
              type: "text",
              localized: true,
              required: true,
              label: { en: "Kicker", fr: "Surtitre" },
            },
            accentedText("title"),
            { name: "body", type: "textarea", localized: true, required: true },
            {
              type: "row",
              fields: [
                {
                  name: "primaryCta",
                  type: "text",
                  localized: true,
                  required: true,
                  label: { en: "Primary button", fr: "Bouton principal" },
                },
                {
                  name: "secondaryCta",
                  type: "text",
                  localized: true,
                  required: true,
                  label: { en: "Secondary button", fr: "Bouton secondaire" },
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
              name: "ticker",
              type: "array",
              label: { en: "Ticker", fr: "Bandeau défilant" },
              minRows: 3,
              fields: [
                { name: "label", type: "text", localized: true, required: true },
              ],
            },
            {
              name: "stats",
              type: "array",
              label: { en: "Stats band", fr: "Bandeau de chiffres" },
              minRows: 4,
              maxRows: 4,
              admin: {
                description: {
                  en: "Exactly four, laid out in a row under the hero.",
                  fr: "Exactement quatre, alignés sous l’en-tête.",
                },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "label",
                      type: "text",
                      localized: true,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "sections",
          label: { en: "Sections", fr: "Sections" },
          fields: [
            {
              name: "products",
              type: "group",
              label: { en: "01 · Products", fr: "01 · Produits" },
              fields: sectionHeading(true),
            },
            {
              name: "capabilities",
              type: "group",
              label: { en: "02 · Capabilities", fr: "02 · Savoir-faire" },
              fields: [
                ...sectionHeading(true),
                {
                  name: "items",
                  type: "array",
                  minRows: 1,
                  maxRows: 3,
                  fields: [
                    {
                      name: "icon",
                      type: "select",
                      required: true,
                      options: [
                        { value: "mobile", label: { en: "Phone", fr: "Téléphone" } },
                        { value: "logistics", label: { en: "Truck", fr: "Camion" } },
                        { value: "platform", label: { en: "Code", fr: "Code" } },
                      ],
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
                  ],
                },
              ],
            },
            {
              name: "method",
              type: "group",
              label: { en: "03 · Method", fr: "03 · Méthode" },
              fields: [
                ...sectionHeading(false),
                {
                  name: "steps",
                  type: "array",
                  minRows: 1,
                  maxRows: 4,
                  fields: [
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
                  ],
                },
              ],
            },
            {
              name: "markets",
              type: "group",
              label: { en: "04 · Markets", fr: "04 · Marchés" },
              fields: [
                ...sectionHeading(false),
                {
                  name: "body",
                  type: "textarea",
                  localized: true,
                  required: true,
                },
                {
                  name: "note",
                  type: "text",
                  localized: true,
                  admin: {
                    description: {
                      en: "Small print under the intro. Leave empty to hide.",
                      fr: "Mention en petits caractères sous l’intro. Laissez vide pour masquer.",
                    },
                  },
                },
              ],
            },
            {
              name: "news",
              type: "group",
              label: { en: "05 · News", fr: "05 · Actualités" },
              fields: sectionHeading(false),
            },
            {
              name: "faq",
              type: "group",
              label: { en: "06 · Questions", fr: "06 · Questions" },
              fields: sectionHeading(false),
            },
          ],
        },
        {
          name: "contact",
          label: { en: "07 · Contact", fr: "07 · Contact" },
          fields: [
            accentedText("title"),
            { name: "body", type: "textarea", localized: true, required: true },
            {
              name: "email",
              type: "email",
              required: true,
              admin: {
                description: {
                  en: "Shown next to the form and used as the mailto link.",
                  fr: "Affiché à côté du formulaire et utilisé comme lien mailto.",
                },
              },
            },
          ],
        },
        {
          name: "footer",
          label: { en: "Footer", fr: "Pied de page" },
          fields: [
            {
              name: "tagline",
              type: "text",
              localized: true,
              required: true,
            },
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
