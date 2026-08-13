import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "onPanel";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 font-display font-semibold leading-tight " +
  "border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent border-accent-400 text-white hover:bg-accent-600 active:bg-accent-700",
  secondary:
    "border-line text-foreground hover:bg-foreground/7 active:bg-foreground/14",
  // For use on the deep navy panels, where the canvas tokens have no contrast.
  onPanel:
    "border-white/30 text-panel-foreground hover:bg-white/10 active:bg-white/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-2.5 py-[7px] text-xs tracking-[0.06em]",
  md: "px-[18px] py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

/**
 * Button/link styling as a class function rather than a component, so the same
 * treatment can sit on a `<button>`, an `<a>` or a next-intl `<Link>`.
 */
export function buttonClasses(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
