import path from "node:path";
import { fileURLToPath } from "node:url";
import type { CollectionConfig } from "payload";
import { publicRead } from "@/cms/access";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Uploaded images. Files land in `media/` at the repo root (git-ignored) and
 * are served by Payload at `/api/media/file/<name>`, so the frontend never
 * depends on the `public/` folder being writable at runtime.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: publicRead,
  admin: {
    group: { en: "Content", fr: "Contenu" },
  },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description: {
          en: "Describes the image for screen readers and search engines.",
          fr: "Décrit l’image pour les lecteurs d’écran et les moteurs de recherche.",
        },
      },
    },
  ],
};
