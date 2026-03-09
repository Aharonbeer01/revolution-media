"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

const INPUT_STYLES =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const LABEL_STYLES = "mb-1 block text-sm font-medium text-midnight";

export function RegisterForm({
  tokenHash,
  type,
}: {
  tokenHash: string;
  type: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    // Verify the invite token first
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "invite" | "email",
    });

    if (verifyError) {
      setError(
        "This registration link is invalid or has expired. Please contact us for a new link."
      );
      setLoading(false);
      return;
    }

    // Set the password for the user
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Failed to set password. Please try again.");
      setLoading(false);
      return;
    }

    // Redirect to dashboard — the auth callback will link the user to ambassador record
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
              Set Up Your Account
            </h1>
            <p className="mt-2 text-sm text-midnight/60">
              Create a password to activate your Ambassador account.
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
              <label htmlFor="reg-password" className={LABEL_STYLES}>
                Password <span className="text-gold">*</span>
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_STYLES}
              />
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className={LABEL_STYLES}>
                Confirm Password <span className="text-gold">*</span>
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                minLength={8}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={INPUT_STYLES}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              {loading ? "Creating account..." : "Activate Account"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
