"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Ambassador, AmbassadorStats } from "@/types/ambassador";

interface DashboardContentProps {
  ambassador: Ambassador;
  stats: AmbassadorStats;
}

export function DashboardContent({
  ambassador,
  stats,
}: DashboardContentProps) {
  const statCards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals.toString(),
      icon: (
        <svg
          className="h-6 w-6 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats.pendingReferrals.toString(),
      icon: (
        <svg
          className="h-6 w-6 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Successful",
      value: stats.successfulReferrals.toString(),
      icon: (
        <svg
          className="h-6 w-6 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Commission Earned",
      value:
        stats.totalCommission > 0
          ? `R${stats.totalCommission.toLocaleString()}`
          : "R0",
      icon: (
        <svg
          className="h-6 w-6 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            Ambassador Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-bold text-midnight sm:text-4xl">
            Welcome back, {ambassador.full_name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-warm-white px-4 py-2 shadow-sm">
          <span className="text-xs font-medium text-midnight/50">
            Your referral code
          </span>
          <span className="text-sm font-bold tracking-wide text-gold">
            {ambassador.referral_code || "-"}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-warm-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-midnight/50">
                {stat.label}
              </p>
              {stat.icon}
            </div>
            <p className="mt-3 text-3xl font-bold text-midnight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Submit New Referral */}
        <div className="flex flex-col rounded-lg border border-gold/20 bg-gradient-to-br from-cream to-warm-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
            <svg
              className="h-6 w-6 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-midnight">
            Submit New Referral
          </h2>
          <p className="mt-2 flex-1 text-sm text-midnight/60">
            Know a hospitality business that needs marketing help? Submit their
            details and our team will reach out within 48 hours.
          </p>
          <div className="mt-6">
            <Button href="/ambassador/referrals/new" variant="primary">
              Submit Referral
            </Button>
          </div>
        </div>

        {/* View All Referrals */}
        <div className="flex flex-col rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-midnight/5">
            <svg
              className="h-6 w-6 text-midnight/70"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-midnight">
            View All Submissions
          </h2>
          <p className="mt-2 flex-1 text-sm text-midnight/60">
            Track the status of all your referrals, from pending to successful.
            See which referrals have earned commissions.
          </p>
          <div className="mt-6">
            <Link
              href="/ambassador/referrals"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-deep"
            >
              View referrals
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Your Profile */}
        <div className="flex flex-col rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-midnight/5">
            <svg
              className="h-6 w-6 text-midnight/70"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-bold text-midnight">
            Your Profile
          </h2>
          <p className="mt-2 flex-1 text-sm text-midnight/60">
            View your account details, referral code, and update your password.
          </p>
          <div className="mt-6">
            <Link
              href="/ambassador/profile"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-deep"
            >
              View profile
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Commission info banner */}
      <div className="mt-10 rounded-lg border border-gold/20 bg-cream/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-midnight">
              Commission Summary
            </h3>
            <p className="mt-1 text-sm text-midnight/60">
              Your total earnings from successful referrals.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-medium text-midnight/50">Earned</p>
              <p className="mt-1 text-2xl font-bold text-midnight">
                R{stats.totalCommission.toLocaleString()}
              </p>
            </div>
            <div className="h-10 w-px bg-midnight/10" />
            <div className="text-center">
              <p className="text-xs font-medium text-midnight/50">Paid Out</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                R{stats.paidCommission.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
