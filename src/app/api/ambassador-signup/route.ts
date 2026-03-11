import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendAdminHtmlEmail } from "@/lib/email";

interface AmbassadorSignupData {
  fullName: string;
  email: string;
  phone: string;
  heardAboutUs: string;
  hospitalityConnection?: string;
  agreedToTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: AmbassadorSignupData = await request.json();
    const { fullName, email, phone, heardAboutUs, agreedToTerms } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }
    if (!heardAboutUs || typeof heardAboutUs !== "string" || heardAboutUs.trim().length === 0) {
      return NextResponse.json({ error: "Please tell us how you heard about us." }, { status: 400 });
    }
    if (!agreedToTerms) {
      return NextResponse.json({ error: "You must agree to the terms and conditions." }, { status: 400 });
    }

    // Save to Supabase
    const supabase = createServiceRoleClient();

    const { data: ambassador, error: dbError } = await supabase
      .from("ambassadors")
      .insert({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        heard_about_us: heardAboutUs.trim(),
        hospitality_connection: body.hospitalityConnection?.trim() || null,
        agreed_to_terms: true,
        status: "pending",
      })
      .select("id, approval_token")
      .single();

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "An application with this email already exists." },
          { status: 400 }
        );
      }
      console.error("[DB Error]", dbError);
      return NextResponse.json({ error: "Failed to save application." }, { status: 500 });
    }

    // Send HTML email to admin with Approve and Reject buttons
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const approveUrl = `${siteUrl}/api/ambassador-approve/${ambassador.id}?token=${ambassador.approval_token}`;
    const rejectUrl = `${siteUrl}/api/ambassador-reject/${ambassador.id}?token=${ambassador.approval_token}`;

    await sendAdminHtmlEmail({
      subject: "New Referral Ambassador Application — Revolution Media",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1A1A1A;">New Ambassador Application</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #666;">Full Name</td><td style="padding: 8px 0; font-weight: 600;">${fullName.trim()}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email.trim()}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone.trim()}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Heard About Us</td><td style="padding: 8px 0;">${heardAboutUs.trim()}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Hospitality Connection</td><td style="padding: 8px 0;">${body.hospitalityConnection?.trim() || "Not provided"}</td></tr>
          </table>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${approveUrl}" style="display: inline-block; background-color: #DC9427; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px; margin-right: 12px;">
              Approve Ambassador
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #cc3333; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px;">
              Do Not Approve
            </a>
          </div>
          <p style="color: #999; font-size: 12px;">Clicking approve will send the applicant an invitation to create their ambassador account. Clicking reject will decline the application.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Thank you for applying! We will be in touch within 48 hours." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please check your submission and try again." },
      { status: 400 }
    );
  }
}
