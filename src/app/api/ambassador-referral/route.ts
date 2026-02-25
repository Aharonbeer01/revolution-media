import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

interface AmbassadorReferralData {
  // Ambassador
  ambassadorName: string;
  ambassadorEmail: string;
  referralCode: string;
  referralDate: string;
  // Client
  contactName: string;
  businessName: string;
  businessType: string;
  location: string;
  clientEmail: string;
  phone?: string;
  website?: string;
  // Context
  relationship: string;
  discussedRevolution: string;
  servicesNeeded?: string[];
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AmbassadorReferralData = await request.json();

    const {
      ambassadorName,
      ambassadorEmail,
      referralCode,
      contactName,
      businessName,
      businessType,
      location,
      clientEmail,
      relationship,
      discussedRevolution,
    } = body;

    // Validate required fields
    if (
      !ambassadorName ||
      !ambassadorEmail ||
      !referralCode ||
      !contactName ||
      !businessName ||
      !businessType ||
      !location ||
      !clientEmail ||
      !relationship ||
      !discussedRevolution
    ) {
      return NextResponse.json(
        { error: "All required fields must be completed." },
        { status: 400 }
      );
    }

    if (!clientEmail.includes("@")) {
      return NextResponse.json(
        { error: "A valid client email address is required." },
        { status: 400 }
      );
    }

    // Send notification email
    await sendNotificationEmail({
      subject: "New Referral Submission — Revolution Media Ambassador Program",
      body: [
        "A new referral has been submitted by an ambassador.",
        "",
        "--- Ambassador Details ---",
        `Name: ${ambassadorName}`,
        `Email: ${ambassadorEmail}`,
        `Referral Code: ${referralCode}`,
        `Date: ${body.referralDate}`,
        "",
        "--- Referred Client Details ---",
        `Contact Name: ${contactName}`,
        `Business Name: ${businessName}`,
        `Business Type: ${businessType}`,
        `Location: ${location}`,
        `Client Email: ${clientEmail}`,
        `Phone: ${body.phone || "Not provided"}`,
        `Website: ${body.website || "Not provided"}`,
        "",
        "--- Context ---",
        `Relationship: ${relationship}`,
        `Discussed Revolution Media: ${discussedRevolution}`,
        `Services Needed: ${body.servicesNeeded?.length ? body.servicesNeeded.join(", ") : "None specified"}`,
        `Additional Context: ${body.additionalContext || "None"}`,
      ].join("\n"),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Referral submitted successfully. We will review and reach out to the client within 48 hours.",
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
