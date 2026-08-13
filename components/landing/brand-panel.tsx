import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlowPreset = "hero" | "contact" | "none";

/**
 * The deep navy brand surface: grid paper, soft brand glows, light type.
 *
 * Used for the top of the page and the contact block so both read as the same
 * material rather than two separate dark boxes.
 */
export function BrandPanel({
  glow = "none",
  className,
  children,
}: {
  glow?: GlowPreset;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "gridlines relative overflow-hidden bg-panel text-panel-foreground",
        className,
      )}
    >
      {glow === "hero" ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -top-56 -right-40 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent)_55%,transparent),transparent_62%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-75 -left-35 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-iris)_40%,transparent),transparent_65%)]"
          />
        </>
      ) : null}

      {glow === "contact" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-65 left-[38%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-iris)_42%,transparent),transparent_64%)]"
        />
      ) : null}

      {children}
    </div>
  );
}
