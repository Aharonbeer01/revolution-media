import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambassador Portal",
  description:
    "Submit referrals and track your commissions in the Revolution Media Ambassador Portal.",
};

export default function AmbassadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
