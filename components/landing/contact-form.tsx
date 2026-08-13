"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { buttonClasses } from "@/components/ui/button";
import { Corners } from "@/components/ui/corners";
import { cn } from "@/lib/cn";

const ROLES = ["client", "partner", "investor"] as const;

const fieldClasses =
  "w-full min-h-9 border border-white/25 bg-black/22 px-2.5 py-1.5 text-sm " +
  "text-panel-foreground caret-accent placeholder:text-panel-muted/60 " +
  "focus-visible:border-accent focus-visible:outline-offset-0";

const labelClasses = "mb-1.5 block text-xs text-panel-muted";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const [submitted, setSubmitted] = useState(false);
  const fieldId = useId();

  // TODO: post to a real endpoint or server action. Until then this only
  // acknowledges locally — nothing is sent anywhere.
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="blueprint blueprint-panel grid gap-3.5 bg-white/7 p-7 text-panel-foreground"
    >
      <Corners />

      <div className="grid gap-3.5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor={`${fieldId}-name`}>
            {t("name")}
          </label>
          <input
            id={`${fieldId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            className={fieldClasses}
          />
        </div>

        <div>
          <label className={labelClasses} htmlFor={`${fieldId}-email`}>
            {t("email")}
          </label>
          <input
            id={`${fieldId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldClasses}
          />
        </div>
      </div>

      <fieldset className="m-0 border-0 p-0">
        <legend className={labelClasses}>{t("roleLabel")}</legend>

        <div className="flex flex-wrap border border-white/25">
          {ROLES.map((role, index) => (
            <label
              key={role}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 px-3 py-[7px] text-[0.8125rem]",
                "has-[:checked]:bg-accent has-[:checked]:text-white",
                "not-has-[:checked]:hover:bg-white/10",
                index > 0 && "border-l border-white/25",
              )}
            >
              <input
                type="radio"
                name="role"
                value={role}
                defaultChecked={index === 0}
                className="sr-only"
              />
              {t(`roles.${role}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClasses} htmlFor={`${fieldId}-message`}>
          {t("message")}
        </label>
        <textarea
          id={`${fieldId}-message`}
          name="message"
          rows={4}
          required
          className={cn(fieldClasses, "min-h-22.5 resize-y")}
        />
      </div>

      <button
        type="submit"
        className={buttonClasses("primary", "md", "blueprint mt-2 w-full")}
      >
        <Corners />
        {t("submit")}
      </button>

      <p aria-live="polite" className="m-0 text-xs text-panel-muted">
        {submitted ? t("success") : t("privacy")}
      </p>
    </form>
  );
}
