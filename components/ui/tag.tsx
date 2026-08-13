import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TagTone = "accent" | "iris" | "neutral" | "outline" | "outline-panel";

const toneClasses: Record<TagTone, string> = {
  accent: "bg-accent-100 text-accent-800",
  iris: "bg-iris-100 text-iris-800",
  neutral: "bg-ink-100 text-ink-800",
  outline: "border border-accent text-accent",
  "outline-panel": "border border-white/40 text-accent-300",
};

export function Tag({
  tone = "neutral",
  className,
  children,
}: {
  tone?: TagTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-[3px] text-[0.6875rem] tracking-[0.02em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
