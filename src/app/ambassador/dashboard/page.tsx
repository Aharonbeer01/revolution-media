import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { AmbassadorNav } from "../AmbassadorNav";
import { DashboardContent } from "./DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/ambassador");
  }

  // Fetch ambassador record by auth_user_id
  let { data: ambassador } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  // Fallback: if not found by auth_user_id, try by email and link
  if (!ambassador && user.email) {
    const serviceClient = createServiceRoleClient();
    const { data: byEmail } = await serviceClient
      .from("ambassadors")
      .select("*")
      .eq("email", user.email)
      .single();

    if (byEmail) {
      await serviceClient
        .from("ambassadors")
        .update({ auth_user_id: user.id, status: "active" })
        .eq("id", byEmail.id);
      ambassador = { ...byEmail, auth_user_id: user.id, status: "active" };
    }
  }

  if (!ambassador) {
    redirect("/ambassador");
  }

  // Fetch stats
  const { data: referrals } = await supabase
    .from("referrals")
    .select("status, commission_amount, commission_paid")
    .eq("ambassador_id", ambassador.id);

  const allReferrals = referrals || [];

  const stats = {
    totalReferrals: allReferrals.length,
    pendingReferrals: allReferrals.filter((r) => r.status === "pending").length,
    successfulReferrals: allReferrals.filter((r) => r.status === "successful")
      .length,
    totalCommission: allReferrals
      .filter((r) => r.commission_amount)
      .reduce((sum, r) => sum + (r.commission_amount || 0), 0),
    paidCommission: allReferrals
      .filter((r) => r.commission_paid && r.commission_amount)
      .reduce((sum, r) => sum + (r.commission_amount || 0), 0),
  };

  return (
    <>
      <AmbassadorNav />
      <div className="min-h-screen bg-soft-white">
        <DashboardContent ambassador={ambassador} stats={stats} />
      </div>
    </>
  );
}
