import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

/**
 * POST /api/ambassador-link
 * Links the currently authenticated user to their ambassador record.
 * Called after registration to ensure auth_user_id is set.
 */
export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceClient = createServiceRoleClient();

    // Link auth user to ambassador record and set status to active
    const { data, error } = await serviceClient
      .from("ambassadors")
      .update({ auth_user_id: user.id, status: "active" })
      .eq("email", user.email)
      .is("auth_user_id", null)
      .select("id")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found (already linked or no record)
      console.error("[Ambassador Link Error]", error);
    }

    return NextResponse.json({ success: true, linked: !!data });
  } catch {
    return NextResponse.json(
      { error: "Failed to link account." },
      { status: 500 }
    );
  }
}
