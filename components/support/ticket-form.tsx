"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  confirmTicket,
  resendTicketCode,
  submitTicket,
  type TicketResult,
} from "@/app/(frontend)/[locale]/support/actions";
import { Field, fieldClasses } from "@/components/support/field";
import { buttonClasses } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, Send } from "@/components/ui/icons";
import {
  SUPPORT_CODE_TTL_MINUTES,
  TICKET_CATEGORIES,
  TICKET_LIMITS,
  type TicketErrors,
  validateTicket,
} from "@/lib/tickets";

type CodeError = "throttled" | "codeInvalid" | "codeExpired" | "tooManyAttempts" | "failed";

type Pending = { email: string; values: Record<string, string> };

const linkButton =
  "cursor-pointer whitespace-nowrap text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50";

/**
 * The ticket form, then a dialog asking for the code emailed to the address
 * typed in the form. The ticket is only saved once that code checks out —
 * or straight away when this browser verified the same email in the last
 * 30 minutes (`initialEmail`, read from the signed session cookie).
 */
export function TicketForm({ initialEmail }: { initialEmail: string | null }) {
  const t = useTranslations("Support");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<TicketErrors>({});
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ reference: string; emailed: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [pending, setPending] = useState<Pending | null>(null);
  const [codeError, setCodeError] = useState<{ code: CodeError; minutes?: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Opening/closing follows `pending`; the dialog's own `close` event
  // (Escape key) clears it back.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (pending && !dialog.open) {
      dialog.showModal();
      codeRef.current?.focus();
    } else if (!pending && dialog.open) {
      dialog.close();
    }
  }, [pending]);

  const minutes = (retryAfter: number) => Math.max(1, Math.ceil(retryAfter / 60));

  /** Shared handling of what the server answers to any of the three actions. */
  function handleResult(result: TicketResult, from: "form" | "dialog") {
    if (result.ok) {
      setPending(null);
      setCreated({ reference: result.reference, emailed: result.emailed });
      formRef.current?.reset();
      return;
    }
    if ("errors" in result) {
      setPending(null);
      setErrors(result.errors);
      return;
    }
    if ("needsCode" in result) {
      if (from === "dialog") setNotice(t("verify.resent"));
      return;
    }
    if (result.error === "throttled") {
      const message = t("verifyErrors.throttled", { minutes: minutes(result.retryAfter) });
      if (from === "dialog") setCodeError({ code: "throttled", minutes: minutes(result.retryAfter) });
      else setEmailNotice(message);
      return;
    }
    if (from === "dialog") setCodeError({ code: result.error });
    else setToast(t("form.failed"));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    setEmailNotice(null);
    const parsed = validateTicket(values);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      const result = await submitTicket({ values, locale });
      if (!result.ok && "needsCode" in result) {
        setCodeError(null);
        setNotice(null);
        setPending({ email: result.email, values });
      } else {
        handleResult(result, "form");
      }
    } catch {
      setToast(t("form.failed"));
    } finally {
      setBusy(false);
    }
  }

  async function onConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pending) return;
    const code = String(new FormData(event.currentTarget).get("code") ?? "");

    setCodeError(null);
    setNotice(null);
    setConfirming(true);
    try {
      handleResult(await confirmTicket({ values: pending.values, code, locale }), "dialog");
    } catch {
      setCodeError({ code: "failed" });
    } finally {
      setConfirming(false);
    }
  }

  async function onResend() {
    if (!pending) return;
    setCodeError(null);
    setNotice(null);
    setConfirming(true);
    try {
      handleResult(await resendTicketCode({ email: pending.email, locale }), "dialog");
    } catch {
      setCodeError({ code: "failed" });
    } finally {
      setConfirming(false);
    }
  }

  const fieldError = (field: keyof TicketErrors) =>
    errors[field] ? t(`errors.${errors[field]}`) : undefined;

  const codeMessage = codeError
    ? codeError.code === "throttled"
      ? t("verifyErrors.throttled", { minutes: codeError.minutes ?? 1 })
      : t(`verifyErrors.${codeError.code}`)
    : undefined;

  return (
    <>
      {created ? (
        <div className="py-10 text-center" aria-live="polite">
          <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-primary" />
          <p className="eyebrow text-accent">{t("created.kicker")}</p>
          <p className="mt-4 font-display text-4xl text-move md:text-5xl">{created.reference}</p>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t("created.body")}</p>
          {created.emailed ? (
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {t("created.emailed")}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setCreated(null)}
            className={buttonClasses("brandOutline", "mt-8 h-12 px-4")}
          >
            {t("created.again")} <ArrowUpRight />
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="mb-7 border-b border-border pb-6">
            <p className="mb-2 text-xs font-bold text-primary uppercase">{t("form.step")}</p>
            <h2 className="text-2xl font-bold">{t("form.title")}</h2>
          </div>

          <Field label={t("form.category")} error={fieldError("category")}>
            <select name="category" className={fieldClasses} defaultValue="commande">
              {TICKET_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {t(`categories.${category}`)}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label={t("form.name")} error={fieldError("name")}>
              <input
                name="name"
                autoComplete="name"
                maxLength={TICKET_LIMITS.name}
                className={fieldClasses}
              />
            </Field>
            <Field label={t("form.email")} error={fieldError("email") ?? emailNotice ?? undefined}>
              <input
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                defaultValue={initialEmail ?? ""}
                maxLength={TICKET_LIMITS.email}
                className={fieldClasses}
              />
            </Field>
          </div>

          <Field label={t("form.orderNumber")} error={fieldError("orderNumber")}>
            <input
              name="orderNumber"
              autoComplete="off"
              spellCheck={false}
              maxLength={TICKET_LIMITS.orderNumber}
              placeholder={t("form.orderPlaceholder")}
              className={fieldClasses}
            />
          </Field>

          <Field label={t("form.subject")} error={fieldError("subject")}>
            <input
              name="subject"
              autoComplete="off"
              maxLength={TICKET_LIMITS.subject}
              className={fieldClasses}
            />
          </Field>

          <Field label={t("form.message")} error={fieldError("message")}>
            <textarea
              name="message"
              rows={6}
              maxLength={TICKET_LIMITS.message}
              className={fieldClasses}
            />
          </Field>

          <button
            type="submit"
            disabled={busy}
            className={buttonClasses("brand", "h-12 w-full px-6 sm:w-auto")}
          >
            {busy ? t("form.sending") : t("form.submit")}
            <Send />
          </button>
        </form>
      )}

      {/* Code confirmation. Native <dialog>: modal, focus-trapped, Escape closes. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="ticket-code-title"
        onClose={() => setPending(null)}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-md border border-t-2 border-border border-t-primary bg-background p-0 text-foreground shadow-editorial backdrop:bg-[oklch(0.22_0.018_280/0.45)]"
      >
        {pending ? (
          <form onSubmit={onConfirm} className="space-y-5 p-6 md:p-8" noValidate>
            <div>
              <p className="mb-2 text-xs font-bold text-primary uppercase">{t("verify.kicker")}</p>
              <h2 id="ticket-code-title" className="text-2xl font-bold">
                {t("verify.title")}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("verify.intro", { email: pending.email, minutes: SUPPORT_CODE_TTL_MINUTES })}
            </p>
            <Field label={t("verify.code")} error={codeMessage}>
              <input
                ref={codeRef}
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]*"
                maxLength={6}
                required
                className={`${fieldClasses} text-center font-mono text-2xl tracking-[0.5em]`}
              />
            </Field>
            {notice ? (
              <p className="text-sm font-medium text-primary" aria-live="polite">
                {notice}
              </p>
            ) : null}
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={confirming}
                className={buttonClasses("brand", "h-12 w-full px-6")}
              >
                {confirming ? t("verify.checking") : t("verify.confirm")}
                <Send />
              </button>
              <div className="flex justify-center gap-5">
                <button
                  type="button"
                  disabled={confirming}
                  onClick={() => void onResend()}
                  className={linkButton}
                >
                  {t("verify.resend")}
                </button>
                <button
                  type="button"
                  disabled={confirming}
                  onClick={() => setPending(null)}
                  className={linkButton}
                >
                  {t("verify.cancel")}
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </dialog>

      {/* Failure notice, styled after the reference design's toaster. */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[calc(100%-2rem)] max-w-[356px] justify-end sm:right-8 sm:bottom-8"
      >
        {toast ? (
          <p
            role="alert"
            className="animate-toast-in pointer-events-auto w-full rounded-lg border border-border bg-background p-4 text-sm font-medium text-foreground shadow-lg"
          >
            {toast}
          </p>
        ) : null}
      </div>
    </>
  );
}
