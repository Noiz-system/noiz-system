import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLanding } from "@/lib/cms";

export async function SiteFooter() {
  const [{ footer }, t] = await Promise.all([
    getLanding(),
    getTranslations("Footer"),
  ]);

  return (
    <footer className="border-t border-panel-line bg-panel text-panel-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-6 px-7 py-8.5">
        <span className="block bg-gradient-to-br from-accent-400 to-iris-500 p-px">
          <Image
            src="/noiz-logo.webp"
            alt="Noiz Systems"
            width={36}
            height={36}
            className="block h-9 w-9 object-cover"
          />
        </span>

        <span className="font-display text-xs tracking-[0.14em] text-panel-muted uppercase">
          {footer.tagline}
        </span>

        <span className="ml-auto text-[0.8125rem] text-panel-muted/70">
          {t("rights")}
        </span>
      </div>
    </footer>
  );
}
