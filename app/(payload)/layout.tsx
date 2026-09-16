import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";
import "./custom.css";

/**
 * Root layout for the admin panel. It is a second root layout, deliberately
 * separate from the site's so the panel neither inherits the marketing
 * fonts and Tailwind reset nor needs a locale segment.
 */
export default function PayloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};
