import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AmbassadorNav } from "../AmbassadorNav";
import { ProfileContent } from "./ProfileContent";

export default async function ProfilePage() {
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
      <div className="min-h-screen bg-soft-white">
        <ProfileContent ambassador={ambassador} />
      </div>
    </>
  );
}
