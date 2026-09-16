import { getTranslations } from "next-intl/server";
import { Corners } from "@/components/ui/corners";
import { SectionHeading } from "@/components/ui/section-heading";
import { getLanding, getLatestPosts } from "@/lib/cms";
import { cn } from "@/lib/cn";
import { SECTION_IDS, sectionIndex } from "@/lib/sections";

/**
 * `12.06.2026` in every language — the design uses one numeric form rather
 * than each locale's own, so the kicker lines up across the three cards.
 */
function shortDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getUTCFullYear()}`;
}

export async function News() {
  const [{ sections }, posts, t] = await Promise.all([
    getLanding(),
    getLatestPosts(),
    getTranslations("News"),
  ]);

  return (
    <section
      id={SECTION_IDS.news}
      className="scroll-mt-24 border-t border-line"
    >
      <div className="mx-auto w-full max-w-[1240px] px-7 py-19.5">
        <SectionHeading
          index={sectionIndex(SECTION_IDS.news)}
          title={sections.news.title}
          action={
            <a
              href={`#${SECTION_IDS.news}`}
              className="px-1 text-sm text-accent underline-offset-4 hover:underline"
            >
              {t("allPosts")}
            </a>
          }
          className="mb-8"
        />

        <div className="grid gap-6.5 md:grid-cols-3">
          {posts.map((post, index) => {
            const external = Boolean(post.link);

            return (
              <a
                key={post.id}
                href={post.link || `#${SECTION_IDS.news}`}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="blueprint group flex flex-col no-underline transition-transform duration-250 ease-out hover:-translate-y-1"
              >
                <Corners />

                <span
                  aria-hidden
                  className={cn(
                    "h-[3px] origin-left scale-x-0 transition-transform duration-350 ease-out group-hover:scale-x-100",
                    index % 2 === 0
                      ? "bg-gradient-to-r from-accent to-iris"
                      : "bg-gradient-to-r from-iris to-accent",
                  )}
                />

                <span className="grid gap-2.5 px-6 pt-5.5 pb-6.5">
                  <span className="text-[0.625rem] tracking-[0.1em] text-iris-700 uppercase dark:text-iris-400">
                    {`${t(`categories.${post.category}`)} · ${shortDate(post.publishedAt)}`}
                  </span>

                  <span className="font-display text-[1.3125rem] leading-tight font-semibold">
                    {post.title}
                  </span>

                  <span className="text-sm text-muted">{post.excerpt}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
