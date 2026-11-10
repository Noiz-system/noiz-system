import { cn } from "@/lib/cn";

export type ButtonVariant = "brand" | "brandOutline";

/**
 * The reference design's two button styles, resolved to their final class
 * lists (shared base + variant). Callers add size and spacing (`h-12 px-6`…)
 * and, unless they pass their own display class, get `inline-flex`.
 *
 * A class function rather than a component, so the same treatment can sit on
 * a `<button>`, an `<a>` or a next-intl `<Link>`.
 */
const base =
  "items-center justify-center gap-2 whitespace-nowrap rounded-sm py-2 text-sm font-bold tracking-normal uppercase " +
  "cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  brand: "bg-primary text-primary-foreground hover:bg-primary/90",
  brandOutline:
    "border border-primary bg-background text-primary hover:bg-secondary",
};

const DISPLAY = /(^|\s)(hidden|block|flex|grid|inline-flex)(\s|$)/;

export function buttonClasses(variant: ButtonVariant, className = "") {
  return cn(
    DISPLAY.test(className) ? null : "inline-flex",
    base,
    variants[variant],
    className,
  );
}
