import type { Field, GlobalConfig, TextField } from "payload";
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
 * Localized text that may stay empty: fields added after the landing row
 * existed cannot be NOT NULL, and an empty value hides that bit of the page.
 */
function optionalText(name: string, label?: TextField["label"]): TextField {
  return { name, type: "text", localized: true, ...(label ? { label } : {}) };
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
            {
              ...accentedText("tagline", { en: "Tagline", fr: "Accroche" }),
              // Optional so the column can be added to a database that
              // already holds a landing page.
              required: false,
            },
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
                  en: "Not displayed on the current design.",
                  fr: "Non affiché dans le design actuel.",
                },
              },
            },
            {
              name: "ticker",
              type: "array",
              label: { en: "Ticker", fr: "Bandeau défilant" },
              minRows: 3,
              admin: {
                description: {
                  en: "Not displayed on the current design.",
                  fr: "Non affiché dans le design actuel.",
                },
              },
              fields: [
                { name: "label", type: "text", localized: true, required: true },
              ],
            },
            {
              name: "stats",
              type: "array",
              label: { en: "Stats band", fr: "Bandeau de chiffres" },
              minRows: 1,
              maxRows: 4,
              admin: {
                description: {
                  en: "Not displayed on the current design.",
                  fr: "Non affiché dans le design actuel.",
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
              name: "company",
              type: "group",
              label: { en: "01 · Company", fr: "01 · La société" },
              fields: [
                { ...accentedText("title"), required: false },
                {
                  name: "lead",
                  type: "textarea",
                  localized: true,
                  label: { en: "Lead paragraph", fr: "Paragraphe d’introduction" },
                  admin: {
                    description: {
                      en: "Shown larger, above the other paragraphs.",
                      fr: "Affiché en plus grand, au-dessus des autres paragraphes.",
                    },
                  },
                },
                {
                  name: "paragraphs",
                  type: "array",
                  maxRows: 4,
                  labels: {
                    singular: { en: "Paragraph", fr: "Paragraphe" },
                    plural: { en: "Paragraphs", fr: "Paragraphes" },
                  },
                  fields: [
                    {
                      name: "text",
                      type: "textarea",
                      localized: true,
                      required: true,
                    },
                  ],
                },
                {
                  name: "founder",
                  type: "group",
                  label: { en: "Founder", fr: "Fondateur" },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "name",
                          type: "text",
                          label: { en: "Name", fr: "Nom" },
                        },
                        {
                          name: "role",
                          type: "text",
                          localized: true,
                          label: { en: "Role", fr: "Fonction" },
                        },
                      ],
                    },
                    {
                      type: "row",
                      fields: [
                        {
                          name: "kicker",
                          type: "text",
                          localized: true,
                          label: { en: "Kicker", fr: "Surtitre" },
                        },
                        {
                          name: "cta",
                          type: "text",
                          localized: true,
                          label: { en: "Button label", fr: "Libellé du bouton" },
                          admin: {
                            description: {
                              en: "Scrolls to the contact section.",
                              fr: "Renvoie vers la section contact.",
                            },
                          },
                        },
                      ],
                    },
                    {
                      name: "portrait",
                      type: "upload",
                      relationTo: "media",
                      admin: {
                        description: {
                          en: "Square photo, shown at 260 × 260.",
                          fr: "Photo carrée, affichée en 260 × 260.",
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "vision",
              type: "group",
              label: { en: "02 · Vision", fr: "02 · Notre vision" },
              fields: [
                { name: "title", type: "text", localized: true },
                {
                  name: "lede",
                  type: "textarea",
                  localized: true,
                  label: { en: "Lede", fr: "Chapeau" },
                },
                {
                  name: "items",
                  type: "array",
                  maxRows: 3,
                  labels: {
                    singular: { en: "Goal", fr: "Objectif" },
                    plural: { en: "Goals", fr: "Objectifs" },
                  },
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
              name: "products",
              type: "group",
              label: { en: "04 · Products", fr: "04 · Produits" },
              fields: sectionHeading(true),
            },
            {
              name: "capabilities",
              type: "group",
              label: {
                en: "Capabilities (not displayed)",
                fr: "Savoir-faire (non affiché)",
              },
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
              label: { en: "03 · Approach", fr: "03 · Notre démarche" },
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
              label: { en: "Markets (not displayed)", fr: "Marchés (non affiché)" },
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
              label: { en: "News (not displayed)", fr: "Actualités (non affiché)" },
              fields: sectionHeading(false),
            },
            {
              name: "help",
              type: "group",
              label: { en: "Help centre band", fr: "Bandeau centre d’aide" },
              admin: {
                description: {
                  en: "Call to action between the products and the questions. Leave the title empty to hide it.",
                  fr: "Appel à l’action entre les produits et les questions. Laissez le titre vide pour le masquer.",
                },
              },
              // Optional so the columns can be added to a database that
              // already holds a landing page.
              fields: [
                {
                  type: "row",
                  fields: [
                    optionalText("kicker", { en: "Kicker", fr: "Surtitre" }),
                    optionalText("cta", { en: "Button label", fr: "Libellé du bouton" }),
                  ],
                },
                optionalText("title"),
                { name: "body", type: "textarea", localized: true },
              ],
            },
            {
              name: "faq",
              type: "group",
              label: { en: "05 · Questions", fr: "05 · Questions" },
              fields: sectionHeading(false),
            },
          ],
        },
        {
          name: "contact",
          label: { en: "06 · Contact", fr: "06 · Contact" },
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
              name: "cta",
              type: "group",
              label: { en: "Closing call to action", fr: "Appel à l’action final" },
              admin: {
                description: {
                  en: "The white band above the footer. Leave the title empty to hide it.",
                  fr: "Le bandeau blanc au-dessus du pied de page. Laissez le titre vide pour le masquer.",
                },
              },
              fields: [
                optionalText("kicker", { en: "Kicker", fr: "Surtitre" }),
                { ...accentedText("title"), required: false },
                {
                  ...optionalText("button", { en: "Button label", fr: "Libellé du bouton" }),
                  admin: {
                    description: {
                      en: "Scrolls to the contact section.",
                      fr: "Renvoie vers la section contact.",
                    },
                  },
                },
              ],
            },
            {
              name: "address",
              type: "textarea",
              label: { en: "Postal address", fr: "Adresse postale" },
              admin: {
                description: {
                  en: "One line per row, shown under the company links.",
                  fr: "Une ligne par rangée, affichée sous les liens de la société.",
                },
              },
            },
            {
              ...optionalText("supportLink", {
                en: "Support link",
                fr: "Lien vers le support",
              }),
              admin: {
                description: {
                  en: "Shown next to the logo, links to the help centre.",
                  fr: "Affiché à côté du logo, renvoie vers le centre d’aide.",
                },
              },
            },
            optionalText("rights", { en: "Copyright line", fr: "Mention de copyright" }),
            {
              name: "legal",
              type: "textarea",
              localized: true,
              label: { en: "Legal notice", fr: "Mentions légales" },
              admin: {
                description: {
                  en: "Company form and registration numbers.",
                  fr: "Forme juridique et numéros d’immatriculation.",
                },
              },
            },
            {
              name: "tagline",
              type: "text",
              localized: true,
              required: true,
              admin: {
                description: {
                  en: "Not displayed on the current design.",
                  fr: "Non affiché dans le design actuel.",
                },
              },
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
