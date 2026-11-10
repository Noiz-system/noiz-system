import type { ReactNode } from "react";

export const fieldClasses =
  "w-full min-w-0 rounded-sm border border-input bg-paper px-4 py-3 text-foreground outline-none transition-colors " +
  "focus:border-ring focus:bg-background focus:ring-2 focus:ring-primary/10";

/** A labelled control; wrapping the input makes the whole label clickable. */
export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-destructive">{error}</span>
      ) : null}
    </label>
  );
}
