"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  createTicket,
  requestSupportCode,
  resetSupportEmail,
  verifySupportCode,
} from "@/app/(frontend)/[locale]/support/actions";
import { Field, fieldClasses } from "@/components/support/field";
import { buttonClasses } from "@/components/ui/button";
import { ArrowUpRight, Check, CheckCircle2, Send } from "@/components/ui/icons";
import {
  SUPPORT_CODE_TTL_MINUTES,
  TICKET_CATEGORIES,
  TICKET_LIMITS,
  type TicketErrors,
  validateTicket,
} from "@/lib/tickets";

type Step = "email" | "code" | "ticket";

type VerifyError =
  | "emailInvalid"
  | "accountNotFound"
  | "throttled"
  | "codeInvalid"
  | "codeExpired"
  | "tooManyAttempts"
  | "notVerified"
  | "failed";

const linkButton =
  "cursor-pointer text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Ticket creation in three steps: prove the email belongs to a BDMarket
 * account (code sent to that inbox), then describe the request. The server
 * keeps the verified email in a signed cookie, so `initialEmail` lets a
 * reload land straight on the last step.
 */
export function TicketForm({ initialEmail }: { initialEmail: string | null }) {
  const t = useTranslations("Support");
  const locale = useLocale();

  const [step, setStep] = useState<Step>(initialEmail ? "ticket" : "email");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [verifyError, setVerifyError] = useState<{ code: VerifyError; minutes?: number } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [errors, setErrors] = useState<TicketErrors>({});
  const [created, setCreated] = useState<{ reference: string; emailed: boolean } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function showVerifyError(code: VerifyError, retryAfter?: number) {
    setNotice(null);
    setVerifyError({
      code,
      minutes: retryAfter ? Math.max(1, Math.ceil(retryAfter / 60)) : undefined,
    });
  }

  async function sendCode(target: string, isResend = false) {
    setBusy(true);
    setVerifyError(null);
    setNotice(null);
    try {
      const result = await requestSupportCode({ email: target, locale });
      if (result.ok) {
        setEmail(result.email);
        setStep("code");
        if (isResend) setNotice(t("verify.resent"));
      } else {
        showVerifyError(result.error, "retryAfter" in result ? result.retryAfter : undefined);
      }
    } catch {
      showVerifyError("failed");
    } finally {
      setBusy(false);
    }
  }

  async function onEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("email") ?? "");
    await sendCode(value);
  }

  async function onCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get("code") ?? "");
    setBusy(true);
    setVerifyError(null);
    setNotice(null);
    try {
      const result = await verifySupportCode({ email, code });
      if (result.ok) {
        setName(result.name);
        setStep("ticket");
      } else {
        showVerifyError(result.error);
      }
    } catch {
      showVerifyError("failed");
    } finally {
      setBusy(false);
    }
  }

  async function changeEmail() {
    setVerifyError(null);
    setNotice(null);
    setErrors({});
    setStep("email");
    await resetSupportEmail().catch(() => undefined);
  }

  async function onTicketSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    const parsed = validateTicket({ ...values, email });
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }

    setErrors({});
    setBusy(true);
    try {
      const result = await createTicket({ values, locale });
      if (result.ok) {
        setCreated({ reference: result.reference, emailed: result.emailed });
        form.reset();
      } else if ("errors" in result) {
        setErrors(result.errors);
      } else if (result.error === "notVerified") {
        setStep("email");
        showVerifyError("notVerified");
      } else {
        setToast(t("form.failed"));
      }
    } catch {
      setToast(t("form.failed"));
    } finally {
      setBusy(false);
    }
  }

  const fieldError = (field: keyof TicketErrors) =>
    errors[field] ? t(`errors.${errors[field]}`) : undefined;

  const verifyMessage = verifyError
    ? verifyError.code === "throttled"
      ? t("verifyErrors.throttled", { minutes: verifyError.minutes ?? 1 })
      : t(`verifyErrors.${verifyError.code}`)
    : undefined;

  const header = (title: string) => (
    <div className="mb-7 border-b border-border pb-6">
      <p className="mb-2 text-xs font-bold text-primary uppercase">{t("form.step")}</p>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );

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
      ) : step === "email" ? (
        <form onSubmit={onEmailSubmit} className="space-y-5" noValidate>
          {header(t("verify.emailTitle"))}
          <p className="text-muted-foreground">{t("verify.emailIntro")}</p>
          <Field label={t("verify.email")} error={verifyMessage}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              required
              defaultValue={email}
              maxLength={TICKET_LIMITS.email}
              className={fieldClasses}
            />
          </Field>
          <button
            type="submit"
            disabled={busy}
            className={buttonClasses("brand", "h-12 w-full px-6 sm:w-auto")}
          >
            {busy ? t("verify.sending") : t("verify.sendCode")}
            <Send />
          </button>
        </form>
      ) : step === "code" ? (
        <form onSubmit={onCodeSubmit} className="space-y-5" noValidate>
          {header(t("verify.codeTitle"))}
          <p className="text-muted-foreground">
            {t("verify.codeIntro", { email, minutes: SUPPORT_CODE_TTL_MINUTES })}
          </p>
          <Field label={t("verify.code")} error={verifyMessage}>
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              required
              autoFocus
              className={`${fieldClasses} max-w-xs text-center font-mono text-2xl tracking-[0.5em]`}
            />
          </Field>
          {notice ? (
            <p className="text-sm font-medium text-primary" aria-live="polite">
              {notice}
            </p>
          ) : null}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={busy}
              className={buttonClasses("brand", "h-12 w-full px-6 sm:w-auto")}
            >
              {busy ? t("verify.checking") : t("verify.confirm")}
              <Check />
            </button>
            <div className="flex gap-5">
              <button
                type="button"
                disabled={busy}
                onClick={() => void sendCode(email, true)}
                className={linkButton}
              >
                {t("verify.resend")}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void changeEmail()}
                className={linkButton}
              >
                {t("verify.changeEmail")}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={onTicketSubmit} className="space-y-5" noValidate>
          {header(t("form.title"))}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-input bg-paper px-4 py-3">
            <p className="flex min-w-0 items-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <span className="font-medium text-foreground">{t("verify.verified")}</span>
              <span className="truncate text-muted-foreground">{email}</span>
            </p>
            <button type="button" onClick={() => void changeEmail()} className={linkButton}>
              {t("verify.changeEmail")}
            </button>
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
                defaultValue={name}
                key={name}
                maxLength={TICKET_LIMITS.name}
                className={fieldClasses}
              />
            </Field>
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
          </div>

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
