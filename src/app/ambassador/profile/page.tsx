import { redirect } from "next/navigation";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
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

  let { data: ambassador } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

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

  return (
    <>
      <AmbassadorNav />
      <div className="min-h-screen bg-soft-white">
        <ProfileContent ambassador={ambassador} />
      </div>
    </>
  );
}
