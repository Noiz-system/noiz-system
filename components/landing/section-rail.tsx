"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { RAIL_SECTIONS } from "@/lib/sections";

/**
 * Fixed left-hand index that highlights the section currently in view.
 *
 * Ratios are accumulated in a ref because an IntersectionObserver callback only
 * reports sections whose visibility *changed*; picking the best of that partial
 * batch alone would flicker to a barely-visible section on fast scrolls.
 */
export function SectionRail() {
  const t = useTranslations("Rail");
  const [active, setActive] = useState<string | null>(null);
  const ratios = useRef(new Map<string, number>());

  useEffect(() => {
    const elements = RAIL_SECTIONS.map((id) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const seen = ratios.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let best: string | null = null;
        let bestRatio = 0;

        for (const [id, ratio] of seen) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }

        setActive(best);
      },
      // Only count a section once it reaches the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      seen.clear();
    };
  }, []);

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="fixed top-1/2 left-6.5 z-40 hidden -translate-y-1/2 flex-col gap-3.5 font-display text-[0.6875rem] tracking-[0.16em] 2xl:flex"
    >
      {RAIL_SECTIONS.map((id, index) => {
        const isActive = active === id;

        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "transition-colors",
              isActive
                ? "font-bold text-accent"
                : "text-foreground/45 hover:text-accent-400",
            )}
          >
            {String(index + 1).padStart(2, "0")} {t(id)}
          </a>
        );
      })}
    </nav>
  );
}
