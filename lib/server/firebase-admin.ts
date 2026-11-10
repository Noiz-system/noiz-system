import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Server-side access to the BDMarket Firebase project (`bdmarket-63c35`):
 * Auth, to check that an email belongs to a customer account, and Firestore,
 * where support tickets live so the BDMarket back-office can process them.
 *
 * Credentials, in order:
 * - `FIREBASE_SERVICE_ACCOUNT`: the service-account JSON, raw or base64
 *   (what a host's env-var UI can hold);
 * - otherwise Application Default Credentials (`GOOGLE_APPLICATION_CREDENTIALS`
 *   pointing at the JSON file, or the host's own identity);
 * - with `FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST` set, the
 *   local emulators, which need none.
 *
 * Runs under its own app name so it can never collide with another Firebase
 * initialisation in the same process.
 */
const APP_NAME = "bdmarket";

function serviceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT?.trim();
  if (!raw) return undefined;
  const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  return cert(JSON.parse(json));
}

function app(): App {
  const existing = getApps().find((candidate) => candidate.name === APP_NAME);
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is not set");
  }

  const credential = serviceAccount();
  return initializeApp({ projectId, ...(credential ? { credential } : {}) }, APP_NAME);
}

export function bdmarketAuth() {
  return getAuth(app());
}

export function bdmarketDb() {
  return getFirestore(app());
}
