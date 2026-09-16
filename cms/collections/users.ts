import type { CollectionConfig } from "payload";

/** Admin accounts. Payload's auth adds email, password and login handling. */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: { en: "Admin", fr: "Administration" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
