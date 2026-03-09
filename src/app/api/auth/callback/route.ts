import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as
    | "invite"
    | "email"
    | "recovery"
    | "signup"
    | null;
  const next = searchParams.get("next") ?? "/ambassador/dashboard";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Get the authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Link auth user to ambassador record and set status to "active"
        const serviceClient = createServiceRoleClient();
        await serviceClient
          .from("ambassadors")
          .update({ auth_user_id: user.id, status: "active" })
          .eq("email", user.email!);
      }

      return NextResponse.redirect(new URL(next, siteUrl));
    }
  }

  // If verification failed, redirect to login with error
  return NextResponse.redirect(
    new URL("/ambassador?error=auth_callback_failed", siteUrl)
  );
}
