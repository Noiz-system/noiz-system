"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { lookupTicket } from "@/app/(frontend)/[locale]/support/actions";
import { Field, fieldClasses } from "@/components/support/field";
import { buttonClasses } from "@/components/ui/button";
import { Search } from "@/components/ui/icons";
import { SUPPORT_ANCHORS } from "@/lib/sections";
import type { TicketSummary } from "@/lib/tickets";

export function TicketLookup() {
  const t = useTranslations("Support");
  const locale = useLocale();
  const [found, setFound] = useState<TicketSummary | "none" | null>(null);

  async function onLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const ticket = await lookupTicket({
        reference: data.get("reference"),
        email: data.get("email"),
      });
      setFound(ticket ?? "none");
    } catch {
      setFound("none");
    }
  }

  return (
    <div
      id={SUPPORT_ANCHORS.tracking}
      className="rounded-md border border-t-2 border-border border-t-primary bg-card p-6 shadow-editorial"
    >
      <p className="mb-4 text-xs font-bold text-primary uppercase">
        {t("lookup.step")}
      </p>
      <h2 className="text-2xl font-semibold">{t("lookup.title")}</h2>

      <form onSubmit={onLookup} className="mt-6 space-y-4">
        <Field label={t("lookup.reference")}>
          <input
            name="reference"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder={t("lookup.referencePlaceholder")}
            className={fieldClasses}
          />
        </Field>
        <Field label={t("lookup.email")}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
            placeholder={t("lookup.emailPlaceholder")}
            className={fieldClasses}
          />
        </Field>
        <button
          type="submit"
          className={buttonClasses("brandOutline", "h-12 w-full px-4")}
        >
          <Search />
          {t("lookup.submit")}
        </button>
      </form>

      <div aria-live="polite">
        {found === "none" ? (
          <p className="mt-4 text-sm text-destructive">{t("lookup.notFound")}</p>
        ) : null}

        {found && found !== "none" ? (
          <div className="mt-4 rounded-md border border-border p-4 text-sm">
            <p className="font-mono text-accent">{found.reference}</p>
            <p className="mt-1 font-semibold">{found.subject}</p>
            <p className="mt-2 text-muted-foreground">
              {t("lookup.status")}{" "}
              <span className="text-foreground">
                {t(`statuses.${found.status}`)}
              </span>
            </p>
            <p className="text-muted-foreground">
              {t("lookup.createdOn", {
                date: new Intl.DateTimeFormat(locale).format(
                  new Date(found.createdAt),
                ),
              })}
            </p>

            {found.replies.length > 0 ? (
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-3 text-xs font-bold text-primary uppercase">
                  {t("lookup.replies")}
                </p>
                <ul className="space-y-3">
                  {found.replies.map((reply, index) => (
                    <li key={index} className="border-l-2 border-primary pl-3">
                      <p className="text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(reply.createdAt))}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-foreground">
                        {reply.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
