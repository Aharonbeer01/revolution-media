import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNotificationEmail } from "@/lib/email";

interface ReferralPayload {
  contactName: string;
  businessName: string;
  businessType: string;
  location: string;
  clientEmail: string;
  phone?: string;
  website?: string;
  relationship: string;
  discussedRevolution: string;
  servicesNeeded?: string[];
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get ambassador record
    const { data: ambassador } = await supabase
      .from("ambassadors")
      .select("id, full_name, email, referral_code")
      .eq("auth_user_id", user.id)
      .single();

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador record not found." },
        { status: 404 }
      );
    }

    const body: ReferralPayload = await request.json();

    const {
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(clientEmail.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required for the client." },
        { status: 400 }
      );
    }

    // Insert referral into database
    const { error: insertError } = await supabase.from("referrals").insert({
      ambassador_id: ambassador.id,
      contact_name: contactName,
      business_name: businessName,
      business_type: businessType,
      location,
      client_email: clientEmail,
      phone: body.phone || null,
      website: body.website || null,
      relationship,
      discussed_revolution: discussedRevolution,
      services_needed: body.servicesNeeded || [],
      additional_context: body.additionalContext || null,
    });

    if (insertError) {
      console.error("[Referral Insert Error]", insertError);
      return NextResponse.json(
        { error: "Failed to save referral. Please try again." },
        { status: 500 }
      );
    }

    // Send notification email to admin
    await sendNotificationEmail({
      subject: `New Referral from ${ambassador.full_name} (${ambassador.referral_code})`,
      body: [
        `Ambassador: ${ambassador.full_name} (${ambassador.email})`,
        `Referral Code: ${ambassador.referral_code}`,
        "",
        "--- Referred Client ---",
        `Contact: ${contactName}`,
        `Business: ${businessName} (${businessType})`,
        `Location: ${location}`,
        `Email: ${clientEmail}`,
        `Phone: ${body.phone || "N/A"}`,
        `Website: ${body.website || "N/A"}`,
        "",
        "--- Context ---",
        `Relationship: ${relationship}`,
        `Discussed Revolution: ${discussedRevolution}`,
        `Services: ${body.servicesNeeded?.join(", ") || "None specified"}`,
        `Notes: ${body.additionalContext || "None"}`,
      ].join("\n"),
    });

    return NextResponse.json(
      { success: true, message: "Referral submitted successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }
}
