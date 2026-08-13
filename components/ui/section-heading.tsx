import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Two-digit index shown before the title, e.g. "01". */
  index: string;
  title: ReactNode;
  /** Optional supporting line, right-aligned on wide screens. */
  lede?: ReactNode;
  /** Trailing slot, e.g. a "view all" link. */
  action?: ReactNode;
  /** Render for the dark brand panels instead of the default canvas. */
  onPanel?: boolean;
  className?: string;
};

export function SectionHeading({
  index,
  title,
  lede,
  action,
  onPanel = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-5 gap-y-3", className)}>
      <span
        className={cn(
          "font-display text-xs tracking-[0.16em]",
          onPanel ? "text-iris-400" : "text-iris-700 dark:text-iris-400",
        )}
      >
        {index}
      </span>

      <h2
        className={cn(
          "m-0 text-[clamp(2.125rem,4vw,3.375rem)] leading-[0.95]",
          onPanel && "text-panel-foreground",
        )}
      >
        {title}
      </h2>

      {lede ? (
        <p
          className={cn(
            "m-0 ml-auto max-w-[24em] text-[0.9375rem]",
            onPanel ? "text-panel-muted" : "text-muted",
          )}
        >
          {lede}
        </p>
      ) : null}

      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  );
}
