import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Corners } from "@/components/ui/corners";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { SECTION_IDS } from "@/lib/sections";

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

const CAPABILITIES = [
  {
    key: "mobile",
    accent: "text-accent",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  {
    key: "logistics",
    accent: "text-iris-600 dark:text-iris-400",
    icon: (
      <svg {...iconProps}>
        <rect x="1" y="6" width="14" height="10" />
        <path d="M15 9h4l3 3v4h-7z" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    ),
  },
  {
    key: "platform",
    accent: "text-accent",
    icon: (
      <svg {...iconProps}>
        <polyline points="8 6 3 12 8 18" />
        <polyline points="16 6 21 12 16 18" />
      </svg>
    ),
  },
] as const satisfies ReadonlyArray<{
  key: string;
  accent: string;
  icon: ReactNode;
}>;

export async function Capabilities() {
  const [t, items] = await Promise.all([
    getTranslations("Capabilities"),
    getTranslations("Capabilities.items"),
  ]);

  return (
    <section
      id={SECTION_IDS.capabilities}
      className="scroll-mt-24 border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1240px] px-7 py-19.5">
        <SectionHeading
          index={t("index")}
          title={t("title")}
          lede={t("lede")}
          className="mb-9"
        />

        <div className="blueprint grid md:grid-cols-3">
          <Corners />

          {CAPABILITIES.map((capability, index) => (
            <div
              key={capability.key}
              className={cn(
                "px-7 pt-7.5 pb-8.5",
                index > 0 && "border-t border-line md:border-t-0 md:border-l",
              )}
            >
              <div className={cn("mb-4.5", capability.accent)}>
                {capability.icon}
              </div>

              <h3 className="m-0 mb-2.5 text-[1.4375rem]">
                {items(`${capability.key}.title`)}
              </h3>

              <p className="m-0 text-[0.90625rem] text-muted">
                {items(`${capability.key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
