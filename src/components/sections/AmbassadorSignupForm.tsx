"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Expression of interest in the Referral Ambassador Program. Nothing is
 * stored and no account is made: the team is emailed, and sends a portal
 * invitation from Advantage Pro when it is a good fit. The agreement is
 * accepted on the portal with the invitation; here it is linked so it can
 * be read before anybody ticks the box.
 */
const AGREEMENT_URL = "https://portal.revolutionmedia.agency/ambassador/agreement";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  heardAboutUs: "",
  network: "",
  agreedToTerms: false,
  website: "",
};

export function AmbassadorSignupForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formStarted, setFormStarted] = useState(false);

  function handleFormStart() {
    if (!formStarted) {
      setFormStarted(true);
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "form_start",
          form_name: "ambassador_signup",
        });
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (status === "sending" || !formData.agreedToTerms) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError("Please enter a valid email address (e.g. you@example.com)");
      return;
    }
    setEmailError("");

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/ambassador-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData(emptyForm);

        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({
            event: "ambassador_signup_submit",
          });
          window.dataLayer.push({
            event: "generate_lead",
            lead_source: "ambassador_signup",
          });
        }
      } else {
        const data = await response.json().catch(() => null);
        setErrorMessage(typeof data?.error === "string" ? data.error : "");
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
          Thank you for your interest
        </h3>
        <p className="mt-3 text-midnight/60">
          We review every request and will be in touch by email. When it is a
          good fit, that email is your invitation to the ambassador portal,
          where you set up your login and get your referral link.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
      <form onSubmit={handleSubmit} onFocus={handleFormStart} className="space-y-5">
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
            maxLength={120}
            autoComplete="name"
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
            maxLength={254}
            autoComplete="email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (emailError) setEmailError("");
            }}
            onBlur={() => {
              if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
                setEmailError("Please enter a valid email address (e.g. you@example.com)");
              } else {
                setEmailError("");
              }
            }}
            className={`${inputStyles} ${emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
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
            maxLength={40}
            autoComplete="tel"
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
            maxLength={200}
            placeholder="e.g. LinkedIn, a friend, Google..."
            value={formData.heardAboutUs}
            onChange={(e) =>
              setFormData({ ...formData, heardAboutUs: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* The businesses they know */}
        <div>
          <label
            htmlFor="network"
            className="mb-1 block text-sm font-medium text-midnight"
          >
            The businesses you know
          </label>
          <textarea
            id="network"
            rows={4}
            maxLength={2000}
            placeholder="Tell us a little about your network and the kinds of businesses you could introduce us to..."
            value={formData.network}
            onChange={(e) =>
              setFormData({ ...formData, network: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        {/* Left empty by people; filled by bots that complete every field. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
        </div>

        {/* Agreement */}
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
            I have read the{" "}
            <a
              href={AGREEMENT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold-deep underline underline-offset-4"
              data-track="referral_agreement_open"
            >
              Referral Ambassador Agreement
            </a>{" "}
            and would like to join on its terms
          </label>
        </div>

        <Button type="submit" variant="primary" className="w-full">
          {status === "sending" ? "Sending..." : "Register My Interest"}
        </Button>

        {status === "error" && (
          <p className="text-center text-sm font-medium text-red-600">
            {errorMessage || "Something went wrong. Please try again or email us directly."}
          </p>
        )}
      </form>
    </div>
  );
}
