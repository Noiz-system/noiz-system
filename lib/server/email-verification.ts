import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { bdmarketAuth, bdmarketDb } from "@/lib/server/firebase-admin";
import { SUPPORT_CODE_TTL_MINUTES } from "@/lib/tickets";

/**
 * Email ownership check for the help center, in three parts:
 *
 * 1. the email must belong to a BDMarket customer account (Firebase Auth);
 * 2. a 6-digit code goes to that inbox; only its salted hash is stored, with
 *    an expiry and an attempt counter (`supportEmailCodes`), and sends are
 *    rate-limited per address (`supportEmailThrottle`);
 * 3. the right code earns a short-lived, HMAC-signed, httpOnly cookie naming
 *    the verified email. Ticket creation trusts that cookie, never an email
 *    sent by the browser.
 *
 * Both Firestore collections are server-only: the security rules deny every
 * client, and only the Admin SDK used here touches them. Modelled on the
 * password-reset codes of BDMarket's Cloud Functions.
 */

const CODE_TTL_MS = SUPPORT_CODE_TTL_MINUTES * 60 * 1000;
const MAX_ATTEMPTS = 5;
const THROTTLE_WINDOW_MS = 60 * 60 * 1000;
const THROTTLE_MAX_SENDS = 5;
const THROTTLE_MIN_INTERVAL_MS = 60 * 1000;
const SESSION_TTL_S = 30 * 60;

export const SESSION_COOKIE = "nz_support_email";

function secret(): string {
  const value = process.env.SUPPORT_SECRET || process.env.PAYLOAD_SECRET;
  if (!value) throw new Error("SUPPORT_SECRET (or PAYLOAD_SECRET) is not set");
  return value;
}

/** Firestore document id for an address: a hash, so no raw email in ids. */
function emailKey(email: string): string {
  return createHash("sha256").update(email).digest("hex");
}

function hashCode(email: string, code: string): string {
  return createHmac("sha256", secret()).update(`code:${email}:${code}`).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && left.length > 0 && timingSafeEqual(left, right);
}

export type CustomerAccount = { uid: string; name: string };

/** The BDMarket account using this email, or `null` when there is none. */
export async function findCustomerAccount(email: string): Promise<CustomerAccount | null> {
  try {
    const user = await bdmarketAuth().getUserByEmail(email);
    if (user.disabled) return null;

    let name = user.displayName?.trim() ?? "";
    if (!name) {
      const profile = await bdmarketDb().collection("users").doc(user.uid).get();
      const data = profile.data();
      name = [data?.firstName, data?.lastName]
        .filter((part): part is string => typeof part === "string" && part.trim() !== "")
        .join(" ");
    }
    return { uid: user.uid, name };
  } catch (error) {
    if ((error as { code?: string }).code === "auth/user-not-found") return null;
    throw error;
  }
}

/**
 * Counts one send against the address's quota.
 * Returns the seconds to wait when the quota is spent, `0` when allowed.
 */
async function consumeSendQuota(email: string): Promise<number> {
  const db = bdmarketDb();
  const ref = db.collection("supportEmailThrottle").doc(emailKey(email));

  return db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const now = Date.now();
    const data = snap.data() as
      | { count?: number; windowStart?: number; lastSentAt?: number }
      | undefined;

    const sinceLast = now - (data?.lastSentAt ?? 0);
    if (sinceLast < THROTTLE_MIN_INTERVAL_MS) {
      return Math.ceil((THROTTLE_MIN_INTERVAL_MS - sinceLast) / 1000);
    }

    const windowStart = data?.windowStart ?? 0;
    const inWindow = now - windowStart < THROTTLE_WINDOW_MS;
    const count = inWindow ? (data?.count ?? 0) : 0;

    if (count >= THROTTLE_MAX_SENDS) {
      return Math.ceil((windowStart + THROTTLE_WINDOW_MS - now) / 1000);
    }

    transaction.set(ref, {
      count: count + 1,
      windowStart: inWindow ? windowStart : now,
      lastSentAt: now,
    });
    return 0;
  });
}

export type IssueCodeResult =
  | { ok: true; code: string }
  | { ok: false; retryAfter: number };

/** Draws a new code for the address, replacing any previous one. */
export async function issueCode(email: string): Promise<IssueCodeResult> {
  const retryAfter = await consumeSendQuota(email);
  if (retryAfter > 0) return { ok: false, retryAfter };

  const code = String(randomInt(100000, 1000000));
  await bdmarketDb()
    .collection("supportEmailCodes")
    .doc(emailKey(email))
    .set({
      codeHash: hashCode(email, code),
      expiresAt: Date.now() + CODE_TTL_MS,
      attempts: 0,
      createdAt: Date.now(),
    });

  return { ok: true, code };
}

export type CheckCodeResult = "ok" | "codeInvalid" | "codeExpired" | "tooManyAttempts";

/** Checks a submitted code; a correct code is consumed. */
export async function checkCode(email: string, code: string): Promise<CheckCodeResult> {
  const db = bdmarketDb();
  const ref = db.collection("supportEmailCodes").doc(emailKey(email));

  return db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const data = snap.data() as
      | { codeHash: string; expiresAt: number; attempts: number }
      | undefined;

    if (!data) return "codeExpired";

    if (Date.now() > data.expiresAt) {
      transaction.delete(ref);
      return "codeExpired";
    }

    if (data.attempts >= MAX_ATTEMPTS) {
      transaction.delete(ref);
      return "tooManyAttempts";
    }

    if (!safeEqualHex(data.codeHash, hashCode(email, code))) {
      const attempts = data.attempts + 1;
      if (attempts >= MAX_ATTEMPTS) {
        transaction.delete(ref);
        return "tooManyAttempts";
      }
      transaction.update(ref, { attempts });
      return "codeInvalid";
    }

    transaction.delete(ref);
    return "ok";
  });
}

/* --- Verified-email session ---------------------------------------------- */

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(`session:${payload}`).digest("base64url");
}

export async function startSession(email: string): Promise<void> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_S;
  const payload = `${Buffer.from(email).toString("base64url")}.${expires}`;
  const store = await cookies();
  store.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
}

/** The verified email carried by the session cookie, if it is still valid. */
export async function readSession(): Promise<string | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;

  const [encodedEmail, expires, signature] = value.split(".");
  if (!encodedEmail || !expires || !signature) return null;

  const payload = `${encodedEmail}.${expires}`;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(expires) * 1000 < Date.now()) return null;

  return Buffer.from(encodedEmail, "base64url").toString("utf8");
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
