import type { ReactNode } from "react";

/** Centred section opener: index, title, then an optional lede. */
export function SectionHeading({
  index,
  title,
  lede,
}: {
  /** Two-digit index shown above the title, e.g. "01". */
  index: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <p className="mb-3 text-sm font-bold tracking-widest text-primary uppercase">
        {index}
      </p>
      <h2 className="text-3xl leading-tight font-bold md:text-5xl">{title}</h2>
      {lede ? <p className="mt-4 text-lg text-muted-foreground">{lede}</p> : null}
    </div>
  );
}
