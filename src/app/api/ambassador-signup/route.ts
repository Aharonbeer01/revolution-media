import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

interface AmbassadorSignupData {
  fullName: string;
  email: string;
  phone?: string;
  heardAboutUs?: string;
  hospitalityConnection?: string;
  agreedToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: AmbassadorSignupData = await request.json();

    const { fullName, email, agreedToTerms } = body;

    // Validate required fields
    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: "You must agree to the terms and conditions." },
        { status: 400 }
      );
    }

    // Send notification email
    await sendNotificationEmail({
      subject: "New Referral Ambassador Application — Revolution Media",
      body: [
        "A new referral ambassador application has been submitted.",
        "",
        `Full Name: ${fullName.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${body.phone?.trim() || "Not provided"}`,
        `Heard About Us: ${body.heardAboutUs?.trim() || "Not provided"}`,
        `Hospitality Connection: ${body.hospitalityConnection?.trim() || "Not provided"}`,
        `Agreed to Terms: Yes`,
      ].join("\n"),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for applying! We will be in touch within 48 hours.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request. Please check your submission and try again.",
      },
      { status: 400 }
    );
  }
}
