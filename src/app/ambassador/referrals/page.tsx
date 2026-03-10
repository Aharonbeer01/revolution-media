import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { AmbassadorNav } from "../AmbassadorNav";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  successful: "bg-green-100 text-green-800",
  unsuccessful: "bg-red-100 text-red-800",
};

function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ReferralsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/ambassador");
  }

  // Get ambassador
  let { data: ambassador } = await supabase
    .from("ambassadors")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!ambassador && user.email) {
    const serviceClient = createServiceRoleClient();
    const { data: byEmail } = await serviceClient
      .from("ambassadors")
      .select("id")
      .eq("email", user.email)
      .single();

    if (byEmail) {
      await serviceClient
        .from("ambassadors")
        .update({ auth_user_id: user.id, status: "active" })
        .eq("id", byEmail.id);
      ambassador = byEmail;
    }
  }

  if (!ambassador) {
    redirect("/ambassador");
  }

  // Get referrals
  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("ambassador_id", ambassador.id)
    .order("created_at", { ascending: false });

  const allReferrals = referrals || [];

  return (
    <>
      <AmbassadorNav />
      <div className="min-h-screen bg-soft-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-midnight">
                Your Referrals
              </h1>
              <p className="mt-1 text-sm text-midnight/60">
                {allReferrals.length} referral
                {allReferrals.length !== 1 ? "s" : ""} submitted
              </p>
            </div>
            <Button href="/ambassador/referrals/new" variant="primary">
              Submit New Referral
            </Button>
          </div>

          {/* Referrals list */}
          {allReferrals.length === 0 ? (
            <div className="mt-12 rounded-lg border border-midnight/10 bg-warm-white p-10 text-center">
              <p className="text-lg font-medium text-midnight">
                No referrals yet
              </p>
              <p className="mt-2 text-sm text-midnight/60">
                Submit your first referral to get started.
              </p>
              <div className="mt-6">
                <Button href="/ambassador/referrals/new" variant="primary">
                  Submit New Referral
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {allReferrals.map((referral) => (
                <div
                  key={referral.id}
                  className="rounded-lg bg-warm-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-midnight">
                        {referral.business_name}
                      </h3>
                      <p className="mt-0.5 text-sm text-midnight/60">
                        {referral.contact_name} &middot; {referral.business_type}{" "}
                        &middot; {referral.location}
                      </p>
                      <p className="mt-1 text-xs text-midnight/40">
                        Submitted{" "}
                        {new Date(referral.created_at).toLocaleDateString(
                          "en-ZA",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {referral.commission_amount != null &&
                        referral.commission_amount > 0 && (
                          <span className="text-sm font-semibold text-gold">
                            R{referral.commission_amount.toLocaleString()}
                          </span>
                        )}
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[referral.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formatStatus(referral.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
