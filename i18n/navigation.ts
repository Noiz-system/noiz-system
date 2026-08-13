import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

/**
 * Locale-aware replacements for `next/link` and the navigation hooks. These
 * keep the active locale prefix on every internal href, so a French visitor
 * stays on `/fr` as they move around.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
