"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

const INPUT_STYLES =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const LABEL_STYLES = "mb-1 block text-sm font-medium text-midnight";

export function LoginForm({ errorMessage }: { errorMessage?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMessage || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/ambassador/dashboard");
    router.refresh();
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-soft-white py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-lg bg-warm-white p-8 shadow-sm sm:p-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-midnight">
              Ambassador Portal
            </h1>
            <p className="mt-2 text-sm text-midnight/60">
              Log in to submit referrals and track your commissions.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="login-email" className={LABEL_STYLES}>
                Email <span className="text-gold">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_STYLES}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={LABEL_STYLES}>
                Password <span className="text-gold">*</span>
              </label>
              <input
                id="login-password"
                type="password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_STYLES}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Apply link */}
          <p className="mt-6 text-center text-sm text-midnight/50">
            Not an ambassador yet?{" "}
            <Link
              href="/referral-program"
              className="font-medium text-gold underline underline-offset-2 hover:text-gold-deep"
            >
              Apply here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
