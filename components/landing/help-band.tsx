import { buttonClasses } from "@/components/ui/button";
import { ArrowUpRight } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import { getLanding } from "@/lib/cms";

/** Help-center call to action between the products and the FAQ. */
export async function HelpBand() {
  const { sections } = await getLanding();
  const help = sections.help;
  if (!help?.title) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-6 border-y border-border bg-paper px-6 py-12 md:flex-row md:items-center">
        <div>
          {help.kicker ? <p className="eyebrow text-accent">{help.kicker}</p> : null}
          <h2 className="mt-2 text-3xl font-semibold">{help.title}</h2>
          {help.body ? <p className="mt-2 text-muted-foreground">{help.body}</p> : null}
        </div>
        {help.cta ? (
          <Link
            href="/support"
            className={buttonClasses("brand", "h-12 shrink-0 px-6")}
          >
            {help.cta}
            <ArrowUpRight />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
