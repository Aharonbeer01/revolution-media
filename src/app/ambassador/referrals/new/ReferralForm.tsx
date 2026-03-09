"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Ambassador } from "@/types/ambassador";

const BUSINESS_TYPES = [
  "Hotel",
  "Boutique Hotel",
  "Resort",
  "Safari Lodge",
  "Guest House",
  "Wine Estate",
  "Other",
];

const SERVICES = [
  "Marketing Strategy",
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Social Media Management",
  "Content Creation",
  "Photography",
  "Copywriting",
  "SEO",
  "Email Marketing",
  "Revolution Motion",
];

const INPUT_STYLES =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const LABEL_STYLES = "mb-1 block text-sm font-medium text-midnight";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export function ReferralForm({ ambassador }: { ambassador: Ambassador }) {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const [formData, setFormData] = useState({
    contactName: "",
    businessName: "",
    businessType: "",
    location: "",
    clientEmail: "",
    phone: "",
    website: "",
    relationship: "",
    discussedRevolution: "",
    servicesNeeded: [] as string[],
    additionalContext: "",
  });

  function updateField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleService(service: string) {
    setFormData((prev) => {
      const current = prev.servicesNeeded;
      const updated = current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service];
      return { ...prev, servicesNeeded: updated };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      const response = await fetch("/api/ambassador-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
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
        <h2 className="mt-6 text-2xl font-bold text-midnight">
          Referral Submitted Successfully
        </h2>
        <p className="mt-3 text-midnight/60">
          We will review and reach out to the client within 48 hours. You will
          receive updates at your registered email.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/ambassador/dashboard" variant="primary">
            Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              setSubmitStatus("idle");
              setFormData({
                contactName: "",
                businessName: "",
                businessType: "",
                location: "",
                clientEmail: "",
                phone: "",
                website: "",
                relationship: "",
                discussedRevolution: "",
                servicesNeeded: [],
                additionalContext: "",
              });
            }}
            variant="secondary"
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/ambassador/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-midnight/50 transition-colors hover:text-midnight"
      >
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Dashboard
      </Link>

      <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-10">
        <h2 className="text-2xl font-bold text-midnight">
          Submit New Referral
        </h2>
        <p className="mt-2 text-sm text-midnight/60">
          Fill in the details below and we will take it from here.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-10">
          {/* Ambassador Details (read-only) */}
          <fieldset>
            <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
              Your Details (Ambassador)
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_STYLES}>Your Name</label>
                <input
                  type="text"
                  readOnly
                  value={ambassador.full_name}
                  className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
                />
              </div>
              <div>
                <label className={LABEL_STYLES}>Your Email</label>
                <input
                  type="email"
                  readOnly
                  value={ambassador.email}
                  className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
                />
              </div>
              <div>
                <label className={LABEL_STYLES}>Referral Code</label>
                <input
                  type="text"
                  readOnly
                  value={ambassador.referral_code || ""}
                  className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
                />
              </div>
              <div>
                <label className={LABEL_STYLES}>Date of Referral</label>
                <input
                  type="date"
                  readOnly
                  value={new Date().toISOString().split("T")[0]}
                  className={`${INPUT_STYLES} cursor-not-allowed bg-soft-white`}
                />
              </div>
            </div>
          </fieldset>

          {/* Client Details */}
          <fieldset>
            <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
              Client Details
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="ref-contact-name" className={LABEL_STYLES}>
                  Contact Name <span className="text-gold">*</span>
                </label>
                <input
                  id="ref-contact-name"
                  type="text"
                  required
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="ref-business-name" className={LABEL_STYLES}>
                  Business Name <span className="text-gold">*</span>
                </label>
                <input
                  id="ref-business-name"
                  type="text"
                  required
                  placeholder="Hotel or business name"
                  value={formData.businessName}
                  onChange={(e) => updateField("businessName", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="ref-business-type" className={LABEL_STYLES}>
                  Business Type <span className="text-gold">*</span>
                </label>
                <select
                  id="ref-business-type"
                  required
                  value={formData.businessType}
                  onChange={(e) => updateField("businessType", e.target.value)}
                  className={INPUT_STYLES}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {BUSINESS_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ref-location" className={LABEL_STYLES}>
                  Location <span className="text-gold">*</span>
                </label>
                <input
                  id="ref-location"
                  type="text"
                  required
                  placeholder="City, region, or country"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="ref-client-email" className={LABEL_STYLES}>
                  Email <span className="text-gold">*</span>
                </label>
                <input
                  id="ref-client-email"
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => updateField("clientEmail", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
              <div>
                <label htmlFor="ref-phone" className={LABEL_STYLES}>
                  Phone
                </label>
                <input
                  id="ref-phone"
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ref-website" className={LABEL_STYLES}>
                  Website
                </label>
                <input
                  id="ref-website"
                  type="url"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>
            </div>
          </fieldset>

          {/* Context */}
          <fieldset>
            <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
              Context
            </legend>
            <div className="space-y-5">
              <div>
                <label htmlFor="ref-relationship" className={LABEL_STYLES}>
                  How do you know this client?{" "}
                  <span className="text-gold">*</span>
                </label>
                <textarea
                  id="ref-relationship"
                  required
                  rows={3}
                  placeholder="Describe your connection or relationship..."
                  value={formData.relationship}
                  onChange={(e) => updateField("relationship", e.target.value)}
                  className={INPUT_STYLES}
                />
              </div>

              <div>
                <p className={LABEL_STYLES}>
                  Have you discussed Revolution Media with them?{" "}
                  <span className="text-gold">*</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-4">
                  {["Yes", "No", "Briefly mentioned"].map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 text-sm text-midnight"
                    >
                      <input
                        type="radio"
                        name="discussedRevolution"
                        required
                        value={option}
                        checked={formData.discussedRevolution === option}
                        onChange={(e) =>
                          updateField("discussedRevolution", e.target.value)
                        }
                        className="h-4 w-4 border-midnight/20 text-gold focus:ring-gold"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className={LABEL_STYLES}>
                  What services do you think they need?
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SERVICES.map((service) => (
                    <label
                      key={service}
                      className="flex cursor-pointer items-center gap-2 rounded border border-midnight/5 px-3 py-2 text-sm text-midnight transition-colors hover:border-gold/30 hover:bg-cream/50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.servicesNeeded.includes(service)}
                        onChange={() => toggleService(service)}
                        className="h-4 w-4 rounded border-midnight/20 text-gold focus:ring-gold"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="ref-additional-context"
                  className={LABEL_STYLES}
                >
                  Additional context
                </label>
                <textarea
                  id="ref-additional-context"
                  rows={3}
                  placeholder="Any other details that could help us..."
                  value={formData.additionalContext}
                  onChange={(e) =>
                    updateField("additionalContext", e.target.value)
                  }
                  className={INPUT_STYLES}
                />
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="border-t border-midnight/5 pt-6">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
            >
              {submitStatus === "sending" ? "Submitting..." : "Submit Referral"}
            </Button>

            {submitStatus === "error" && (
              <p className="mt-4 text-sm font-medium text-red-600">
                Something went wrong. Please try again or contact support.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
