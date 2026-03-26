"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Ambassador } from "@/types/ambassador";

const INPUT_STYLES =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const LABEL_STYLES = "mb-1 block text-sm font-medium text-midnight";

export function ProfileContent({ ambassador }: { ambassador: Ambassador }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [passwordError, setPasswordError] = useState("");

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordStatus("saving");

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError("Failed to update password. Please try again.");
      setPasswordStatus("error");
    } else {
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStatus("success");
      setTimeout(() => setPasswordStatus("idle"), 3000);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-midnight">Your Profile</h1>

      {/* Profile info */}
      <div className="mt-8 rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-midnight">Account Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={LABEL_STYLES}>Full Name</label>
            <input
              type="text"
              readOnly
              value={ambassador.full_name}
              className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
            />
          </div>
          <div>
            <label className={LABEL_STYLES}>Email</label>
            <input
              type="email"
              readOnly
              value={ambassador.email}
              className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
            />
          </div>
          <div>
            <label className={LABEL_STYLES}>Phone</label>
            <input
              type="tel"
              readOnly
              value={ambassador.phone || "-"}
              className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
            />
          </div>
          <div>
            <label className={LABEL_STYLES}>Referral Code</label>
            <input
              type="text"
              readOnly
              value={ambassador.referral_code || "-"}
              className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white font-semibold text-gold`}
            />
          </div>
          <div>
            <label className={LABEL_STYLES}>Status</label>
            <input
              type="text"
              readOnly
              value={ambassador.status.charAt(0).toUpperCase() + ambassador.status.slice(1)}
              className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
            />
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="mt-8 rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-midnight">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
          <div>
            <label htmlFor="new-password" className={LABEL_STYLES}>
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              required
              minLength={8}
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={INPUT_STYLES}
            />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className={LABEL_STYLES}>
              Confirm New Password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              required
              minLength={8}
              placeholder="Re-enter your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={INPUT_STYLES}
            />
          </div>

          {passwordError && (
            <p className="text-sm font-medium text-red-600">{passwordError}</p>
          )}

          {passwordStatus === "success" && (
            <p className="text-sm font-medium text-green-600">
              Password updated successfully.
            </p>
          )}

          <Button type="submit" variant="primary">
            {passwordStatus === "saving" ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
