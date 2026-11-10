"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import {
  checkCode,
  endSession,
  findCustomerAccount,
  issueCode,
  readSession,
  startSession,
} from "@/lib/server/email-verification";
import { emailLayout, escapeHtml, sendMail } from "@/lib/server/mailer";
import { findTicket, saveTicket } from "@/lib/server/support-tickets";
import {
  isValidEmail,
  normalizeCode,
  SUPPORT_CODE_TTL_MINUTES,
  TICKET_LIMITS,
  type TicketErrors,
  type TicketSummary,
  validateTicket,
} from "@/lib/tickets";

/*
 * Public server actions behind the help center. They are reachable by direct
 * POST, so each one validates its own input, and ticket creation trusts only
 * the signed session cookie for the email — never a value sent by the page.
 */

function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function pickLocale(value: unknown): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

async function siteOrigin(): Promise<string> {
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host") ?? "localhost:3000";
  const proto = list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/* --- 1. Send a code -------------------------------------------------------- */

export type RequestCodeResult =
  | { ok: true; email: string }
  | { ok: false; error: "emailInvalid" | "accountNotFound" | "failed" }
  | { ok: false; error: "throttled"; retryAfter: number };

export async function requestSupportCode(input: {
  email: unknown;
  locale: unknown;
}): Promise<RequestCodeResult> {
  const email = normalizeEmail(input.email);
  if (!isValidEmail(email)) return { ok: false, error: "emailInvalid" };

  try {
    const account = await findCustomerAccount(email);
    if (!account) return { ok: false, error: "accountNotFound" };

    const issued = await issueCode(email);
    if (!issued.ok) {
      return { ok: false, error: "throttled", retryAfter: issued.retryAfter };
    }

    const locale = pickLocale(input.locale);
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

    return { ok: true, email };
  } catch (error) {
    console.error("[support] could not send a verification code", error);
    return { ok: false, error: "failed" };
  }
}

/* --- 2. Check the code ----------------------------------------------------- */

export type VerifyCodeResult =
  | { ok: true; email: string; name: string }
  | {
      ok: false;
      error: "codeInvalid" | "codeExpired" | "tooManyAttempts" | "failed";
    };

export async function verifySupportCode(input: {
  email: unknown;
  code: unknown;
}): Promise<VerifyCodeResult> {
  const email = normalizeEmail(input.email);
  const code = normalizeCode(input.code);
  if (!isValidEmail(email) || !code) return { ok: false, error: "codeInvalid" };

  try {
    const result = await checkCode(email, code);
    if (result !== "ok") return { ok: false, error: result };

    await startSession(email);
    const account = await findCustomerAccount(email);
    return { ok: true, email, name: account?.name ?? "" };
  } catch (error) {
    console.error("[support] could not verify a code", error);
    return { ok: false, error: "failed" };
  }
}

/** Forgets the verified email, to start over with another address. */
export async function resetSupportEmail(): Promise<void> {
  await endSession();
}

/* --- 3. Open the ticket ---------------------------------------------------- */

export type CreateTicketResult =
  | { ok: true; reference: string; emailed: boolean }
  | { ok: false; errors: TicketErrors }
  | { ok: false; error: "notVerified" | "failed" };

export async function createTicket(input: {
  values: Record<string, unknown>;
  locale: unknown;
}): Promise<CreateTicketResult> {
  const email = await readSession();
  if (!email) return { ok: false, error: "notVerified" };

  const parsed = validateTicket({ ...input.values, email });
  if (!parsed.ok) return { ok: false, errors: parsed.errors };

  const locale = pickLocale(input.locale);

  try {
    const account = await findCustomerAccount(email);
    if (!account) return { ok: false, error: "notVerified" };

    const reference = await saveTicket({
      ...parsed.data,
      userId: account.uid,
      locale,
    });

    const emailed = await sendTicketConfirmation({
      reference,
      email,
      name: parsed.data.name,
      subject: parsed.data.subject,
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
  } catch (error) {
    console.error("[support] could not create ticket", error);
    return { ok: false, error: "failed" };
  }
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
  const email = normalizeEmail(input.email);

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
