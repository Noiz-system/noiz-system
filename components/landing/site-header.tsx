import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Corners } from "@/components/ui/corners";
import { LocaleSwitcher } from "@/components/landing/locale-switcher";
import { buttonClasses } from "@/components/ui/button";
import { SECTION_IDS } from "@/lib/sections";

export async function SiteHeader() {
  const t = await getTranslations("Nav");

  const links = [
    { id: SECTION_IDS.products, label: t("products") },
    { id: SECTION_IDS.capabilities, label: t("capabilities") },
    { id: SECTION_IDS.markets, label: t("markets") },
    { id: SECTION_IDS.news, label: t("news") },
  ];

  return (
    <header className="relative border-b border-panel-line">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        {t("skipToContent")}
      </a>

      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-7 gap-y-4 px-7 py-3.5">
        <a
          href="#top"
          aria-label={t("home")}
          className="mr-auto flex items-center gap-2.5 text-panel-foreground"
        >
          <span className="block bg-gradient-to-br from-accent-400 to-iris-500 p-px">
            <Image
              src="/noiz-logo.webp"
              alt=""
              width={40}
              height={40}
              priority
              className="block h-10 w-10 object-cover"
            />
          </span>
          <span className="font-display text-xl leading-none font-semibold tracking-[0.03em]">
            NOIZ<span className="brand-text"> SYSTEMS</span>
          </span>
        </a>

        <nav className="hidden items-center gap-5.5 text-sm md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-panel-foreground transition-colors hover:text-iris-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />

          <a
            href={`#${SECTION_IDS.contact}`}
            className={buttonClasses("primary", "md", "blueprint")}
          >
            <Corners />
            {t("bookCall")}
          </a>
        </div>
      </div>
    </header>
  );
}
