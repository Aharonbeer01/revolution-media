import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export default async function AmbassadorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, redirect to dashboard
  if (user) {
    redirect("/ambassador/dashboard");
  }

  const params = await searchParams;
  const errorMessage =
    params.error === "auth_callback_failed"
      ? "Authentication failed. Please try logging in."
      : undefined;

  return <LoginForm errorMessage={errorMessage} />;
}
