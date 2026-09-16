import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";
import { orderField } from "@/cms/fields/order";
import { collectionRevalidation } from "@/cms/hooks/revalidate";

/** Accordion entries in section 06. */
export const Faqs: CollectionConfig = {
  slug: "faqs",
  access: publicRead,
  hooks: collectionRevalidation,
  defaultSort: "order",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    group: { en: "Content", fr: "Contenu" },
  },
  labels: {
    singular: { en: "FAQ", fr: "Question" },
    plural: { en: "FAQs", fr: "Questions fréquentes" },
  },
  fields: [
    {
      name: "question",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "answer",
      type: "textarea",
      localized: true,
      required: true,
    },
    orderField,
  ],
};
