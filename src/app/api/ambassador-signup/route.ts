import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

/**
 * Expression of interest in the Referral Ambassador Program.
 *
 * Since October 2026 the programme runs on the agency's client portal, by
 * invitation. This route stores nothing and creates no account: it emails
 * the team the applicant's details, and the team sends a portal invitation
 * from Advantage Pro when it is a good fit.
 *
 * The email is plain text, so nothing an applicant types can become markup
 * or a link in the team's inbox.
 */

interface AmbassadorInterestData {
  fullName: string;
  email: string;
  phone: string;
  heardAboutUs: string;
  network?: string;
  agreedToTerms: boolean;
  // Hidden from people; a bot that fills every field fills this one too.
  website?: string;
}

const LIMITS = {
  fullName: 120,
  email: 254,
  phone: 40,
  heardAboutUs: 200,
  network: 2000,
};

/** One line, so a field cannot add lines of its own to the email. */
function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function present(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export async function POST(request: NextRequest) {
  try {
    const body: AmbassadorInterestData = await request.json();
    const { fullName, email, phone, heardAboutUs, network, agreedToTerms, website } = body;

    if (typeof website === "string" && website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!present(fullName, LIMITS.fullName)) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!present(email, LIMITS.email) || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!present(phone, LIMITS.phone)) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }
    if (!present(heardAboutUs, LIMITS.heardAboutUs)) {
      return NextResponse.json({ error: "Please tell us how you heard about us." }, { status: 400 });
    }
    if (network !== undefined && (typeof network !== "string" || network.length > LIMITS.network)) {
      return NextResponse.json({ error: "Please shorten the note about your network." }, { status: 400 });
    }
    if (agreedToTerms !== true) {
      return NextResponse.json(
        { error: "Please read and agree to the Referral Ambassador Agreement." },
        { status: 400 }
      );
    }

    const sent = await sendNotificationEmail({
      subject: "Referral ambassador interest - Revolution Media",
      body: [
        "Somebody would like to become a referral ambassador.",
        "",
        `Name: ${oneLine(fullName)}`,
        `Email: ${oneLine(email)}`,
        `Phone: ${oneLine(phone)}`,
        `Heard about us: ${oneLine(heardAboutUs)}`,
        "Agreed to the ambassador agreement: yes",
        "",
        "The businesses they know:",
        network?.trim() || "Not provided",
        "",
        "Nothing has been created for them. To invite them, open Team, then",
        "Ambassadors, in Advantage Pro.",
      ].join("\n"),
    });

    if (!sent.success) {
      return NextResponse.json(
        { error: "We could not send your request. Please email us directly." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you. We review every request and will be in touch by email, with an invitation to the ambassador portal when it is a good fit.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please check your submission and try again." },
      { status: 400 }
    );
  }
}
