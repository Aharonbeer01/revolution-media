"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/ambassador/dashboard" },
  { label: "Referrals", href: "/ambassador/referrals" },
  { label: "Profile", href: "/ambassador/profile" },
];

export function AmbassadorNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/ambassador");
    router.refresh();
  }

  return (
    <nav className="border-b border-midnight/10 bg-warm-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold/10 text-gold"
                    : "text-midnight/60 hover:bg-midnight/5 hover:text-midnight"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-midnight/50 underline underline-offset-2 transition-colors hover:text-midnight"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
