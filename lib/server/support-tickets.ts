import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { bdmarketDb } from "@/lib/server/firebase-admin";
import type { TicketInput, TicketStatus, TicketSummary } from "@/lib/tickets";

/**
 * Support tickets in BDMarket's Firestore, where the back-office's
 * « Tickets support » screen processes them.
 *
 * Shared contract (mirrored in `bd-market-admin-hub/src/lib/support-tickets.ts`
 * and enforced by `rork-bd-market/firestore.rules`):
 *
 *   supportTickets/{reference}
 *     reference, product, category, status, name, email, userId, orderNumber,
 *     subject, message, locale, source, createdAt, updatedAt,
 *     replyCount, lastReplyAt
 *   supportTickets/{reference}/messages/{id}
 *     authorRole: "admin", authorId, authorName, text, createdAt
 *
 * The document id is the reference, so a lookup is a single read.
 */
const COLLECTION = "supportTickets";

/** Unambiguous alphabet: no 0/O, 1/I/L. */
const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function makeReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  let suffix = "";
  for (const byte of bytes) {
    suffix += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return `NZ-${suffix}`;
}

export async function saveTicket(
  ticket: TicketInput & { userId: string | null; locale: string },
): Promise<string> {
  const db = bdmarketDb();

  // `create` fails if the id exists, so a clash among 31^6 references simply
  // draws another one.
  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = makeReference();
    try {
      await db.collection(COLLECTION).doc(reference).create({
        reference,
        product: "bdmarket",
        category: ticket.category,
        status: "ouvert",
        name: ticket.name,
        email: ticket.email.toLowerCase(),
        userId: ticket.userId,
        orderNumber: ticket.orderNumber || null,
        subject: ticket.subject,
        message: ticket.message,
        locale: ticket.locale,
        source: "noiz-systems-site",
        replyCount: 0,
        lastReplyAt: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return reference;
    } catch (error) {
      // gRPC ALREADY_EXISTS
      if ((error as { code?: number }).code === 6) continue;
      throw error;
    }
  }

  throw new Error("Could not allocate a ticket reference");
}

function iso(value: unknown): string {
  return value instanceof Timestamp ? value.toDate().toISOString() : new Date().toISOString();
}

/** A ticket and the team's replies, for someone holding its reference and email. */
export async function findTicket(
  reference: string,
  email: string,
): Promise<TicketSummary | null> {
  const ref = bdmarketDb().collection(COLLECTION).doc(reference);
  const snap = await ref.get();
  const data = snap.data();
  if (!data || data.email !== email) return null;

  const messages = await ref.collection("messages").orderBy("createdAt", "asc").get();

  return {
    reference: data.reference,
    subject: data.subject,
    status: data.status as TicketStatus,
    createdAt: iso(data.createdAt),
    replies: messages.docs
      .map((doc) => doc.data())
      .filter((message) => message.authorRole === "admin")
      .map((message) => ({
        text: String(message.text ?? ""),
        createdAt: iso(message.createdAt),
      })),
  };
}
