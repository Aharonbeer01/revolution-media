import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendHtmlEmail } from "@/lib/email";

function generateReferralCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AMB-${prefix}-${suffix}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!id || !token) {
    return new NextResponse(htmlPage("Invalid Link", "The approval link is missing required parameters."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = createServiceRoleClient();

  // Fetch ambassador
  const { data: ambassador, error: fetchError } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !ambassador) {
    return new NextResponse(htmlPage("Not Found", "Ambassador application not found."), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Validate token
  if (ambassador.approval_token !== token) {
    return new NextResponse(htmlPage("Invalid Token", "The approval token is invalid."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check status
  if (ambassador.status !== "pending") {
    return new NextResponse(
      htmlPage("Already Processed", `This application has already been ${ambassador.status}.`),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  // Generate referral code
  const referralCode = generateReferralCode(ambassador.full_name);

  // Update status to approved
  const { error: updateError } = await supabase
    .from("ambassadors")
    .update({ status: "approved", referral_code: referralCode })
    .eq("id", id);

  if (updateError) {
    console.error("[Approve Error]", updateError);
    return new NextResponse(htmlPage("Error", "Failed to approve the ambassador. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Generate Supabase invite link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "invite",
    email: ambassador.email,
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
    },
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    console.error("[Invite Link Error]", linkError);
    // Still approved, but invite link failed — notify admin
    return new NextResponse(
      htmlPage(
        "Approved (with warning)",
        `${ambassador.full_name} has been approved, but the invite email could not be sent. Please manually send them a registration link.`
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  // Build registration URL
  const hashedToken = linkData.properties.hashed_token;
  const registrationUrl = `${siteUrl}/ambassador/register?token_hash=${hashedToken}&type=invite`;

  // Send welcome email to the ambassador
  await sendHtmlEmail({
    to: ambassador.email,
    subject: "You're Approved! Welcome to the Revolution Media Ambassador Program",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1A1A;">Welcome to Revolution Media!</h2>
        <p style="color: #333; line-height: 1.6;">
          Hi ${ambassador.full_name},
        </p>
        <p style="color: #333; line-height: 1.6;">
          Your Referral Ambassador application has been approved. Click the button below to set up your account and start referring hospitality businesses.
        </p>
        <p style="color: #333; line-height: 1.6;">
          Your referral code: <strong style="color: #DC9427;">${referralCode}</strong>
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${registrationUrl}" style="display: inline-block; background-color: #DC9427; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 16px;">
            Set Up Your Account
          </a>
        </div>
        <p style="color: #999; font-size: 12px;">This link will expire in 24 hours. If you need a new link, please contact us.</p>
      </div>
    `,
  });

  return new NextResponse(
    htmlPage(
      "Ambassador Approved",
      `${ambassador.full_name} has been approved and sent a registration email at ${ambassador.email}. Their referral code is ${referralCode}.`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Revolution Media</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;}
.card{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
h1{color:#1A1A1A;font-size:24px;margin:0 0 16px;}p{color:#666;line-height:1.6;margin:0;}
</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body>
</html>`;
}
