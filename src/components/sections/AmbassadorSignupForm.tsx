"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function AmbassadorSignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    heardAboutUs: "",
    hospitalityConnection: "",
    agreedToTerms: false,
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formData.agreedToTerms) {
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/ambassador-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          heardAboutUs: "",
          hospitalityConnection: "",
          agreedToTerms: false,
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyles =
    "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

  if (status === "success") {
    return (
      <div className="rounded-lg bg-warm-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <svg
            className="h-8 w-8 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-midnight">
          Thank you for applying!
        </h3>
        <p className="mt-3 text-midnight/60">
          We&apos;ll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            placeholder="Your full name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            Email Address <span className="text-gold">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            Phone Number <span className="text-gold">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            placeholder="+27 000 000 0000"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* How did you hear about us */}
        <div>
          <label
            htmlFor="heardAboutUs"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            How did you hear about us? <span className="text-gold">*</span>
          </label>
          <input
            id="heardAboutUs"
            type="text"
            required
            placeholder="e.g. LinkedIn, a friend, Google..."
            value={formData.heardAboutUs}
            onChange={(e) =>
              setFormData({ ...formData, heardAboutUs: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* Hospitality Connection */}
        <div>
          <label
            htmlFor="hospitalityConnection"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            Your connection to the hospitality industry
          </label>
          <textarea
            id="hospitalityConnection"
            rows={4}
            placeholder="Tell us a bit about your relationship with the hospitality industry..."
            value={formData.hospitalityConnection}
            onChange={(e) =>
              setFormData({
                ...formData,
                hospitalityConnection: e.target.value,
              })
            }
            className={inputStyles}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="agreedToTerms"
            type="checkbox"
            required
            checked={formData.agreedToTerms}
            onChange={(e) =>
              setFormData({ ...formData, agreedToTerms: e.target.checked })
            }
            className="mt-1 h-4 w-4 rounded border-midnight/20 text-gold accent-gold focus:ring-gold"
          />
          <label
            htmlFor="agreedToTerms"
            className="text-sm leading-relaxed text-midnight/70"
          >
            I agree to the Referral Ambassador Program terms and conditions
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          {status === "sending" ? "Submitting..." : "Apply to Join"}
        </Button>

        {status === "error" && (
          <p className="text-center text-sm font-medium text-red-600">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </form>
    </div>
  );
}
