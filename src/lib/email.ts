const NOTIFY_EMAIL = "aharon@revolutionmedia.agency";

interface EmailPayload {
  subject: string;
  body: string;
}

/**
 * Send a notification email using the Resend API.
 * Falls back to console logging if RESEND_API_KEY is not set.
 *
 * To enable real emails:
 * 1. Sign up at https://resend.com (free tier: 100 emails/day)
 * 2. Add your domain or verify your email
 * 3. Add RESEND_API_KEY to your Vercel environment variables
 */
export async function sendNotificationEmail({ subject, body }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[Email Preview] To: ${NOTIFY_EMAIL}`);
    console.log(`[Email Preview] Subject: ${subject}`);
    console.log(`[Email Preview] Body:\n${body}`);
    console.log("[Email Preview] Set RESEND_API_KEY to send real emails.");
    return { success: true, preview: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Revolution Media <notifications@revolutionmedia.agency>",
      to: [NOTIFY_EMAIL],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[Email Error]", error);
    return { success: false, error };
  }

  return { success: true };
}
