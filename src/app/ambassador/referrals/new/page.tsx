import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AmbassadorNav } from "../../AmbassadorNav";
import { ReferralForm } from "./ReferralForm";

export default async function NewReferralPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/ambassador");
  }

  const { data: ambassador } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!ambassador) {
    redirect("/ambassador");
  }

  return (
    <>
      <AmbassadorNav />
      <div className="min-h-screen bg-soft-white px-4 py-10 sm:px-6">
        <ReferralForm ambassador={ambassador} />
      </div>
    </>
  );
}
