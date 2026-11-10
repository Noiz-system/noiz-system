"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import {
  checkCode,
  findCustomerAccount,
  hasActiveCode,
  issueCode,
  readSession,
  startSession,
  type CustomerAccount,
} from "@/lib/server/email-verification";
import { emailLayout, escapeHtml, sendMail } from "@/lib/server/mailer";
import { findTicket, saveTicket } from "@/lib/server/support-tickets";
import {
  isValidEmail,
  normalizeCode,
  SUPPORT_CODE_TTL_MINUTES,
  TICKET_LIMITS,
  type TicketErrors,
  type TicketInput,
  type TicketSummary,
  validateTicket,
} from "@/lib/tickets";

/*
 * Public server actions behind the help center. They are reachable by direct
 * POST, so each one validates its own input.
 *
 * A ticket is only saved for an email that belongs to a BDMarket account and
 * that its owner has just proven to control: `submitTicket` sends a code to
 * that inbox, `confirmTicket` checks it and saves the ticket. A correct code
 * also leaves a signed session cookie, so a second ticket for the same email
 * within 30 minutes goes straight through.
 */

function pickLocale(value: unknown): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

async function siteOrigin(): Promise<string> {
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host") ?? "localhost:3000";
  const proto = list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function parse(values: Record<string, unknown>) {
  const parsed = validateTicket(values);
  if (!parsed.ok) return parsed;
  return { ok: true as const, data: { ...parsed.data, email: parsed.data.email.toLowerCase() } };
}

export type TicketResult =
  | { ok: true; reference: string; emailed: boolean }
  | { ok: false; errors: TicketErrors }
  | { ok: false; needsCode: true; email: string }
  | { ok: false; error: "throttled"; retryAfter: number }
  | { ok: false; error: "codeInvalid" | "codeExpired" | "tooManyAttempts" | "failed" };

/* --- 1. Submit the form ---------------------------------------------------- */

export async function submitTicket(input: {
  values: Record<string, unknown>;
  locale: unknown;
}): Promise<TicketResult> {
  const parsed = parse(input.values);
  if (!parsed.ok) return { ok: false, errors: parsed.errors };

  const { data } = parsed;
  const locale = pickLocale(input.locale);

  try {
    const account = await findCustomerAccount(data.email);
    if (!account) return { ok: false, errors: { email: "accountNotFound" } };

    // Already verified in this browser in the last 30 minutes.
    if ((await readSession()) === data.email) {
      return await openTicket(data, account, locale);
    }

    // A code sent moments ago (dialog dismissed, form resubmitted) is still
    // good: reopen the dialog rather than spend another send.
    if (await hasActiveCode(data.email)) {
      return { ok: false, needsCode: true, email: data.email };
    }

    return await sendCode(data.email, locale);
  } catch (error) {
    console.error("[support] could not submit ticket", error);
    return { ok: false, error: "failed" };
  }
}

/* --- 2. Confirm with the emailed code -------------------------------------- */

export async function confirmTicket(input: {
  values: Record<string, unknown>;
  code: unknown;
  locale: unknown;
}): Promise<TicketResult> {
  const parsed = parse(input.values);
  if (!parsed.ok) return { ok: false, errors: parsed.errors };

  const code = normalizeCode(input.code);
  if (!code) return { ok: false, error: "codeInvalid" };

  const { data } = parsed;

  try {
    const result = await checkCode(data.email, code);
    if (result !== "ok") return { ok: false, error: result };

    await startSession(data.email);

    const account = await findCustomerAccount(data.email);
    if (!account) return { ok: false, errors: { email: "accountNotFound" } };

    return await openTicket(data, account, pickLocale(input.locale));
  } catch (error) {
    console.error("[support] could not confirm ticket", error);
    return { ok: false, error: "failed" };
  }
}

/** A fresh code for the email waiting in the confirmation dialog. */
export async function resendTicketCode(input: {
  email: unknown;
  locale: unknown;
}): Promise<TicketResult> {
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) return { ok: false, errors: { email: "emailInvalid" } };

  try {
    if (!(await findCustomerAccount(email))) {
      return { ok: false, errors: { email: "accountNotFound" } };
    }
    return await sendCode(email, pickLocale(input.locale));
  } catch (error) {
    console.error("[support] could not resend the code", error);
    return { ok: false, error: "failed" };
  }
}

/* --- Helpers --------------------------------------------------------------- */

async function sendCode(email: string, locale: Locale): Promise<TicketResult> {
  const issued = await issueCode(email);
  if (!issued.ok) return { ok: false, error: "throttled", retryAfter: issued.retryAfter };

  const t = await getTranslations({ locale, namespace: "SupportEmail.code" });
  const intro = t("intro", { minutes: SUPPORT_CODE_TTL_MINUTES });

  await sendMail({
    to: email,
    subject: t("subject", { code: issued.code }),
    text: `${t("title")}\n\n${issued.code}\n\n${intro}\n\n${t("ignore")}`,
    html: emailLayout(
      escapeHtml(t("title")),
      `<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(intro)}</p>
<p style="margin:0 0 24px;font-family:'Courier New',monospace;font-size:34px;font-weight:bold;letter-spacing:.3em;color:#5b21b6">${issued.code}</p>
<p style="margin:0;font-size:13px;line-height:1.6;color:#6b6a7b">${escapeHtml(t("ignore"))}</p>`,
    ),
  });

  return { ok: false, needsCode: true, email };
}

async function openTicket(
  data: TicketInput,
  account: CustomerAccount,
  locale: Locale,
): Promise<TicketResult> {
  const reference = await saveTicket({ ...data, userId: account.uid, locale });

  const emailed = await sendTicketConfirmation({
    reference,
    email: data.email,
    name: data.name,
    subject: data.subject,
    locale,
  }).then(
    () => true,
    (error) => {
      // The ticket exists either way; the reference is on screen.
      console.error("[support] could not send the ticket confirmation", error);
      return false;
    },
  );

  return { ok: true, reference, emailed };
}

async function sendTicketConfirmation(ticket: {
  reference: string;
  email: string;
  name: string;
  subject: string;
  locale: Locale;
}) {
  const t = await getTranslations({
    locale: ticket.locale,
    namespace: "SupportEmail.ticket",
  });
  const prefix = ticket.locale === routing.defaultLocale ? "" : `/${ticket.locale}`;
  const trackUrl = `${await siteOrigin()}${prefix}/support#suivi`;
  const intro = t("intro", { name: ticket.name });

  await sendMail({
    to: ticket.email,
    subject: t("subject", { reference: ticket.reference, subject: ticket.subject }),
    text: `${t("title")}\n\n${intro}\n\n${ticket.reference}\n\n${t("track")}\n${trackUrl}`,
    html: emailLayout(
      escapeHtml(t("title")),
      `<p style="margin:0 0 16px;font-size:15px;line-height:1.6">${escapeHtml(intro)}</p>
<p style="margin:0 0 20px;font-family:'Courier New',monospace;font-size:26px;font-weight:bold;color:#5b21b6">${ticket.reference}</p>
<p style="margin:0 0 4px;font-size:13px;color:#6b6a7b">${escapeHtml(ticket.subject)}</p>
<p style="margin:20px 0 24px;font-size:15px;line-height:1.6">${escapeHtml(t("track"))}</p>
<a href="${escapeHtml(trackUrl)}" style="display:inline-block;background:#5b21b6;color:#ffffff;padding:12px 22px;font-size:13px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;text-decoration:none">${escapeHtml(t("cta"))}</a>`,
    ),
  });
}

/* --- Tracking -------------------------------------------------------------- */

export async function lookupTicket(input: {
  reference: unknown;
  email: unknown;
}): Promise<TicketSummary | null> {
  const reference =
    typeof input.reference === "string" ? input.reference.trim().toUpperCase() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  if (!/^NZ-[A-Z0-9]{6}$/.test(reference) || reference.length > TICKET_LIMITS.reference) {
    return null;
  }
  if (!isValidEmail(email)) return null;

  try {
    return await findTicket(reference, email);
  } catch (error) {
    console.error("[support] could not look up ticket", error);
    return null;
  }
}
