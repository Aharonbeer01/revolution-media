import { redirect } from "next/navigation";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>;
}) {
  const params = await searchParams;
  const tokenHash = params.token_hash;
  const type = params.type;

  // Must have a valid invite token
  if (!tokenHash || !type) {
    redirect("/ambassador");
  }

  return <RegisterForm tokenHash={tokenHash} type={type} />;
}
