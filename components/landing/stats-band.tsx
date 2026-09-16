import { Corners } from "@/components/ui/corners";
import { getLanding } from "@/lib/cms";
import { cn } from "@/lib/cn";

export async function StatsBand() {
  const { hero } = await getLanding();
  const stats = hero.stats ?? [];

  if (stats.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1240px] px-7">
      <div className="blueprint -mt-px grid grid-cols-2 bg-canvas lg:grid-cols-4">
        <Corners />

        {stats.map((stat, index) => (
          <div
            key={stat.id ?? index}
            className={cn(
              "px-6 pt-5.5 pb-6.5 transition-colors hover:bg-accent/7",
              index > 0 && "border-l border-line",
            )}
          >
            <p className="mb-2 font-display text-[0.6875rem] tracking-[0.14em] text-accent-700 uppercase dark:text-accent-400">
              {stat.label}
            </p>
            <p className="font-display text-[2.75rem] leading-[0.9]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
