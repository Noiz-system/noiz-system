/**
 * Support-ticket rules, shared by the browser form and the server actions so
 * both enforce the same limits. Dependency-free and browser-safe on purpose.
 */

export const TICKET_CATEGORIES = [
  "commande",
  "livraison",
  "paiement",
  "compte",
  "autre",
] as const;

export const TICKET_STATUSES = ["ouvert", "en_cours", "resolu", "ferme"] as const;

export type TicketCategory = (typeof TICKET_CATEGORIES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_LIMITS = {
  name: 100,
  email: 255,
  orderNumber: 50,
  subject: 150,
  message: 3000,
  reference: 20,
} as const;

export type TicketInput = {
  category: TicketCategory;
  name: string;
  email: string;
  orderNumber: string;
  subject: string;
  message: string;
};

export type TicketErrorCode =
  | "categoryInvalid"
  | "nameRequired"
  | "emailInvalid"
  | "subjectShort"
  | "messageShort"
  | "tooLong"
  /** Set by the server: no BDMarket account uses this email. */
  | "accountNotFound";

export type TicketErrors = Partial<Record<keyof TicketInput, TicketErrorCode>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidEmail(value: string): boolean {
  return value.length <= TICKET_LIMITS.email && EMAIL.test(value);
}

export function validateTicket(
  raw: Record<string, unknown>,
): { ok: true; data: TicketInput } | { ok: false; errors: TicketErrors } {
  const data = {
    category: text(raw.category) as TicketCategory,
    name: text(raw.name),
    email: text(raw.email),
    orderNumber: text(raw.orderNumber),
    subject: text(raw.subject),
    message: text(raw.message),
  };

  const errors: TicketErrors = {};

  if (!TICKET_CATEGORIES.includes(data.category)) {
    errors.category = "categoryInvalid";
  }

  if (data.name.length === 0) errors.name = "nameRequired";
  else if (data.name.length > TICKET_LIMITS.name) errors.name = "tooLong";

  if (!isValidEmail(data.email)) errors.email = "emailInvalid";

  if (data.orderNumber.length > TICKET_LIMITS.orderNumber) {
    errors.orderNumber = "tooLong";
  }

  if (data.subject.length < 3) errors.subject = "subjectShort";
  else if (data.subject.length > TICKET_LIMITS.subject) errors.subject = "tooLong";

  if (data.message.length < 10) errors.message = "messageShort";
  else if (data.message.length > TICKET_LIMITS.message) errors.message = "tooLong";

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data };
}

/** Lifetime of an emailed verification code. */
export const SUPPORT_CODE_TTL_MINUTES = 10;

/** A verification code as typed: six digits, spaces tolerated. */
export function normalizeCode(value: unknown): string | null {
  const digits = typeof value === "string" ? value.replace(/\s+/g, "") : "";
  return /^\d{6}$/.test(digits) ? digits : null;
}

/** What the tracking form may reveal about a ticket. */
export type TicketSummary = {
  reference: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  /** Answers posted by the support team from the BDMarket back-office. */
  replies: Array<{ text: string; createdAt: string }>;
};
