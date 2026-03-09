const NOTIFY_EMAIL = "aharon@revolutionmedia.agency";

interface EmailPayload {
  subject: string;
  body: string;
}

interface HtmlEmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send a plain-text notification email to admin via Resend.
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

/**
 * Send an HTML email to a specific recipient via Resend.
 */
export async function sendHtmlEmail({ to, subject, html }: HtmlEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[Email Preview] To: ${to}`);
    console.log(`[Email Preview] Subject: ${subject}`);
    console.log(`[Email Preview] HTML:\n${html}`);
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
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("[Email Error]", error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Send HTML notification to admin (convenience wrapper).
 */
export async function sendAdminHtmlEmail({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  return sendHtmlEmail({ to: NOTIFY_EMAIL, subject, html });
}
