import type { ReactNode } from "react";
import { Corners } from "@/components/ui/corners";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding } from "@/lib/cms";
import { cn } from "@/lib/cn";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";
import type { Landing } from "@/payload-types";

type CapabilityIcon = NonNullable<
  Landing["sections"]["capabilities"]["items"]
>[number]["icon"];

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

/**
 * The icon an editor picks in the CMS is a name; the drawing and its tint
 * stay here, so the palette cannot drift from the design system.
 */
const ICONS: Record<CapabilityIcon, { accent: string; icon: ReactNode }> = {
  mobile: {
    accent: "text-accent",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <line x1="11" y1="18" x2="13" y2="18" />
      </svg>
    ),
  },
  logistics: {
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
  platform: {
    accent: "text-accent",
    icon: (
      <svg {...iconProps}>
        <polyline points="8 6 3 12 8 18" />
        <polyline points="16 6 21 12 16 18" />
      </svg>
    ),
  },
};

export async function Capabilities() {
  const { sections } = await getLanding();
  const { title, lede, items = [] } = sections.capabilities;

  return (
    <section
      id={SECTION_IDS.capabilities}
      className="scroll-mt-24 border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1240px] px-7 py-19.5">
        <SectionHeading
          index={sectionIndex(SECTION_IDS.capabilities)}
          title={title}
          lede={lede}
          className="mb-9"
        />

        <div className="blueprint grid md:grid-cols-3">
          <Corners />

          {(items ?? []).map((capability, index) => {
            const { accent, icon } = ICONS[capability.icon];

            return (
              <div
                key={capability.id ?? index}
                className={cn(
                  "px-7 pt-7.5 pb-8.5",
                  index > 0 && "border-t border-line md:border-t-0 md:border-l",
                )}
              >
                <div className={cn("mb-4.5", accent)}>{icon}</div>

                <h3 className="m-0 mb-2.5 text-[1.4375rem]">
                  {capability.title}
                </h3>

                <p className="m-0 text-[0.90625rem] text-muted">
                  {capability.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
