import type { Messages } from "./i18n/messages";
import type { routing } from "./i18n/routing";

/**
 * Teaches next-intl about this project's locales and message shape, so
 * `useTranslations("Hero")` autocompletes and a typo in a message key is a
 * compile error rather than a `Hero.titel` string on the page.
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
