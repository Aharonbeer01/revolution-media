"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Ambassador, AmbassadorStats } from "@/types/ambassador";

interface DashboardContentProps {
  ambassador: Ambassador;
  stats: AmbassadorStats;
}

export function DashboardContent({ ambassador, stats }: DashboardContentProps) {
  const statCards = [
    { label: "Total Referrals", value: stats.totalReferrals.toString() },
    { label: "Pending", value: stats.pendingReferrals.toString() },
    { label: "Successful", value: stats.successfulReferrals.toString() },
    {
      label: "Commission Earned",
      value: stats.totalCommission > 0 ? `R${stats.totalCommission.toLocaleString()}` : "—",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-midnight">
          Welcome back, {ambassador.full_name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-midnight/60">
          Referral Code:{" "}
          <span className="font-semibold text-gold">
            {ambassador.referral_code}
          </span>
        </p>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-warm-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-midnight/50">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-midnight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-lg border border-gold/20 bg-cream p-6 text-center sm:p-8">
        <h2 className="text-xl font-bold text-midnight">
          Have a new referral?
        </h2>
        <p className="mt-2 text-sm text-midnight/60">
          Submit their details and our team will reach out within 48 hours.
        </p>
        <div className="mt-5">
          <Button href="/ambassador/referrals/new" variant="primary">
            Submit New Referral
          </Button>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/ambassador/referrals"
          className="text-sm font-medium text-gold underline underline-offset-2 hover:text-gold-deep"
        >
          View all referrals
        </Link>
        <span className="text-midnight/20">|</span>
        <Link
          href="/ambassador/profile"
          className="text-sm font-medium text-gold underline underline-offset-2 hover:text-gold-deep"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
}
