import { getLanding } from "@/lib/cms";
import { cn } from "@/lib/cn";

export async function StatsBand() {
  const { hero } = await getLanding();
  const stats = hero.stats ?? [];

  if (stats.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16">
      <div
        className={cn(
          "grid grid-cols-2 border-y border-border",
          stats.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3",
        )}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.id ?? index}
            className="border-r border-border p-6 last:border-r-0"
          >
            <p className="eyebrow text-primary">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
