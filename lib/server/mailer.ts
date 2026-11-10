/**
 * Transactional email through Resend's HTTP API — the provider BDMarket's
 * Cloud Functions already use — without pulling in its SDK.
 *
 * Needs `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (a sender on a domain
 * verified in Resend, e.g. `BDMarket <support@noizsystems.tech>`). In
 * development, without a key, the message is printed to the server console
 * instead, so the flow stays testable locally; in production a missing key is
 * an error.
 */
export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail(mail: Mail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY / RESEND_FROM_EMAIL are not set");
    }
    console.info(
      `[mail:dev] To: ${mail.to}\n[mail:dev] Subject: ${mail.subject}\n${mail.text}`,
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...mail }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** For interpolating visitor-supplied text into an email's HTML. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/** Minimal, inline-styled shell shared by the support emails. */
export function emailLayout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f7f7fb;font-family:Arial,Helvetica,sans-serif;color:#2b2a35">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-top:3px solid #5b21b6;padding:32px">
<tr><td>
<p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;color:#5b21b6">BDMarket · Noiz Systems</p>
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3">${title}</h1>
${body}
</td></tr></table>
</td></tr></table>
</body></html>`;
}
