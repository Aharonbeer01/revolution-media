"use client";

import { useMemo, useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const foundations = [
  {
    id: "organic",
    label: "Organic Foundation",
    description:
      "Social media management, content, and reporting. The equivalent of our Visibility package as your starting point.",
  },
  {
    id: "paid",
    label: "Paid Ads Foundation",
    description:
      "Campaign management with conversion tracking from day one. The equivalent of our Boost package as your starting point.",
  },
] as const;

type FoundationId = (typeof foundations)[number]["id"];

const addOnGroups = [
  {
    label: "Organic & Content",
    options: [
      "More posts and stories per month",
      "Additional platform management",
      "Google Business Profile management",
      "Blog writing (SEO and AEO focused)",
      "Email marketing",
      "Copywriting",
    ],
  },
  {
    label: "Paid Advertising",
    options: [
      "Additional ad campaigns",
      "Additional ad platform (Google, Meta, or TikTok)",
      "Advanced tracking and attribution",
    ],
  },
  {
    label: "Content Production",
    options: [
      "Photography bundle (South Africa only)",
      "Remote Content System (international-friendly: content calendars, shot guides, and remote creative direction; your team films on a phone)",
      "Video production by Revolution Motion (South Africa only)",
    ],
  },
  {
    label: "One-Time Services",
    options: [
      "Digital Presence Audit",
      "Direct Booking Strategy",
      "Content Calendar & Scripts",
      "Ad Campaign Setup",
      "Google Business Profile Overhaul",
    ],
  },
];

// Short labels used only to keep the WhatsApp deep link within length limits.
const addOnShortLabels: Record<string, string> = {
  "More posts and stories per month": "More posts/stories",
  "Additional platform management": "Extra platform",
  "Google Business Profile management": "GBP management",
  "Blog writing (SEO and AEO focused)": "Blog writing",
  "Email marketing": "Email marketing",
  Copywriting: "Copywriting",
  "Additional ad campaigns": "Extra ad campaigns",
  "Additional ad platform (Google, Meta, or TikTok)": "Extra ad platform",
  "Advanced tracking and attribution": "Advanced tracking",
  "Photography bundle (South Africa only)": "Photography bundle",
  "Remote Content System (international-friendly: content calendars, shot guides, and remote creative direction; your team films on a phone)":
    "Remote Content System",
  "Video production by Revolution Motion (South Africa only)": "Video production",
  "Digital Presence Audit": "Digital Presence Audit",
  "Direct Booking Strategy": "Direct Booking Strategy",
  "Content Calendar & Scripts": "Content Calendar & Scripts",
  "Ad Campaign Setup": "Ad Campaign Setup",
  "Google Business Profile Overhaul": "GBP Overhaul",
};

const roomBands = [
  "Under 10",
  "10 to 25",
  "26 to 50",
  "51 to 150",
  "150+ or group",
];

const countries = [
  "South Africa",
  "Botswana",
  "Namibia",
  "Zimbabwe",
  "Zambia",
  "Mozambique",
  "Kenya",
  "Tanzania",
  "Mauritius",
  "Seychelles",
  "Maldives",
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "Portugal",
  "Spain",
  "France",
  "Italy",
  "Greece",
  "Indonesia",
  "Thailand",
  "Other",
];

const WHATSAPP_NUMBER = "27688161597";

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function CustomPackageBuilder() {
  const [selectedFoundations, setSelectedFoundations] = useState<FoundationId[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [details, setDetails] = useState({
    propertyName: "",
    country: "",
    rooms: "",
    website: "",
    notes: "",
    name: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  const hasFoundation = selectedFoundations.length > 0;
  const bothFoundations = selectedFoundations.length === 2;

  const foundationLabels = useMemo(
    () =>
      foundations
        .filter((f) => selectedFoundations.includes(f.id))
        .map((f) => f.label),
    [selectedFoundations]
  );

  function toggleFoundation(id: FoundationId) {
    setSelectedFoundations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleAddOn(option: string) {
    setSelectedAddOns((prev) =>
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  }

  const detailsComplete =
    details.propertyName.trim().length > 0 &&
    details.country.trim().length > 0 &&
    details.rooms.trim().length > 0 &&
    details.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim());

  const canSubmit = hasFoundation && detailsComplete && status !== "sending";

  function pushLeadEvents() {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "custom_package_submit",
        foundation: foundationLabels.join(" + "),
      });
      window.dataLayer.push({
        event: "generate_lead",
        lead_source: "custom_package_builder",
      });
    }
  }

  const whatsappHref = useMemo(() => {
    const foundationText = foundationLabels.length
      ? foundationLabels.join(" and ")
      : "not chosen yet";
    const addOnText = selectedAddOns.length
      ? selectedAddOns.map((a) => addOnShortLabels[a] || a).join(", ")
      : "none";
    const propertyText = [
      details.propertyName.trim() || "property",
      details.country.trim() || "country",
      details.rooms.trim() ? `${details.rooms.trim()} rooms` : "rooms",
    ].join(", ");
    const message = `Hi Revolution Media, I'd like a custom package. Foundation: ${foundationText}. Add-ons: ${addOnText}. Property: ${propertyText}. `;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [foundationLabels, selectedAddOns, details]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!hasFoundation) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim())) {
      setEmailError("Please enter a valid email address (e.g. you@example.com)");
      return;
    }
    setEmailError("");
    setStatus("sending");

    try {
      const response = await fetch("/api/packages/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foundations: foundationLabels,
          addOns: selectedAddOns,
          ...details,
        }),
      });

      if (response.ok) {
        setStatus("success");
        pushLeadEvents();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  function handleWhatsApp() {
    pushLeadEvents();
  }

  const inputStyles =
    "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

  const lockedNote = (
    <p className="mt-2 text-xs text-midnight/50">
      Choose a foundation above to unlock this step.
    </p>
  );

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-gold/30 bg-white p-8 text-center shadow-sm ring-1 ring-gold/10 sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-7 w-7 text-gold"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h3 className="mt-5 text-xl font-bold text-midnight">
          Got it. We&apos;ll review your property and come back within two business
          days with a tailored proposal.
        </h3>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1 */}
        <div className="rounded-lg border border-midnight/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-midnight">
              1
            </span>
            <h3 className="text-lg font-bold text-midnight">
              Choose Your Foundation
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {foundations.map((f) => {
              const active = selectedFoundations.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFoundation(f.id)}
                  aria-pressed={active}
                  className={`flex h-full flex-col rounded-lg border-2 p-5 text-left transition-all ${
                    active
                      ? "border-gold bg-gold/5 ring-1 ring-gold/20"
                      : "border-midnight/10 bg-warm-white hover:border-gold/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-midnight">
                      {f.label}
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        active
                          ? "border-gold bg-gold text-midnight"
                          : "border-midnight/20 text-transparent"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-3 w-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-midnight/70">
                    {f.description}
                  </p>
                </button>
              );
            })}
          </div>
          {bothFoundations && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-deep">
              Most popular: combine both
            </p>
          )}
          {!hasFoundation && (
            <p className="mt-4 text-xs text-midnight/50">
              Select at least one foundation to continue. Custom packages never scope
              below these levels.
            </p>
          )}
        </div>

        {/* STEP 2 */}
        <div
          className={`rounded-lg border border-midnight/10 bg-white p-6 shadow-sm transition-opacity sm:p-8 ${
            hasFoundation ? "" : "pointer-events-none opacity-50"
          }`}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-midnight">
              2
            </span>
            <h3 className="text-lg font-bold text-midnight">Add What You Need</h3>
          </div>
          {!hasFoundation && lockedNote}
          <div className="grid gap-6 sm:grid-cols-2">
            {addOnGroups.map((group) => (
              <div key={group.label}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-gold-deep">
                  {group.label}
                </h4>
                <ul className="space-y-2">
                  {group.options.map((option) => {
                    const checked = selectedAddOns.includes(option);
                    return (
                      <li key={option}>
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-midnight/80">
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!hasFoundation}
                            onChange={() => toggleAddOn(option)}
                            className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-midnight/30 text-gold accent-gold focus:ring-gold"
                          />
                          <span className="leading-relaxed">{option}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 3 */}
        <div
          className={`rounded-lg border border-midnight/10 bg-white p-6 shadow-sm transition-opacity sm:p-8 ${
            hasFoundation ? "" : "pointer-events-none opacity-50"
          }`}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-bold text-midnight">
              3
            </span>
            <h3 className="text-lg font-bold text-midnight">
              Tell Us About Your Property
            </h3>
          </div>
          {!hasFoundation && lockedNote}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="cpb-property"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Property name <span className="text-gold-deep">*</span>
              </label>
              <input
                id="cpb-property"
                type="text"
                required
                disabled={!hasFoundation}
                placeholder="Hotel or property name"
                value={details.propertyName}
                onChange={(e) =>
                  setDetails({ ...details, propertyName: e.target.value })
                }
                className={inputStyles}
              />
            </div>

            <div>
              <label
                htmlFor="cpb-country"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Country <span className="text-gold-deep">*</span>
              </label>
              <select
                id="cpb-country"
                required
                disabled={!hasFoundation}
                value={details.country}
                onChange={(e) =>
                  setDetails({ ...details, country: e.target.value })
                }
                className={`${inputStyles} ${
                  !details.country ? "text-midnight/40" : ""
                }`}
              >
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cpb-rooms"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Number of rooms <span className="text-gold-deep">*</span>
              </label>
              <select
                id="cpb-rooms"
                required
                disabled={!hasFoundation}
                value={details.rooms}
                onChange={(e) => setDetails({ ...details, rooms: e.target.value })}
                className={`${inputStyles} ${
                  !details.rooms ? "text-midnight/40" : ""
                }`}
              >
                <option value="" disabled>
                  Select a range
                </option>
                {roomBands.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cpb-website"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Website URL
              </label>
              <input
                id="cpb-website"
                type="text"
                disabled={!hasFoundation}
                placeholder="yourproperty.com"
                value={details.website}
                onChange={(e) =>
                  setDetails({ ...details, website: e.target.value })
                }
                className={inputStyles}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="cpb-notes"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Anything else we should know
              </label>
              <textarea
                id="cpb-notes"
                rows={3}
                disabled={!hasFoundation}
                placeholder="Goals, timelines, or anything specific to your property..."
                value={details.notes}
                onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                className={inputStyles}
              />
            </div>

            <div>
              <label
                htmlFor="cpb-name"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Name <span className="text-gold-deep">*</span>
              </label>
              <input
                id="cpb-name"
                type="text"
                required
                disabled={!hasFoundation}
                placeholder="Your full name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                className={inputStyles}
              />
            </div>

            <div>
              <label
                htmlFor="cpb-email"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Email <span className="text-gold-deep">*</span>
              </label>
              <input
                id="cpb-email"
                type="email"
                required
                disabled={!hasFoundation}
                placeholder="you@example.com"
                value={details.email}
                onChange={(e) => {
                  setDetails({ ...details, email: e.target.value });
                  if (emailError) setEmailError("");
                }}
                onBlur={() => {
                  if (
                    details.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email.trim())
                  ) {
                    setEmailError(
                      "Please enter a valid email address (e.g. you@example.com)"
                    );
                  } else {
                    setEmailError("");
                  }
                }}
                className={`${inputStyles} ${
                  emailError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {emailError && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="cpb-phone"
                className="mb-1 block text-sm font-medium text-midnight"
              >
                Phone / WhatsApp number
              </label>
              <input
                id="cpb-phone"
                type="tel"
                disabled={!hasFoundation}
                placeholder="Optional"
                value={details.phone}
                onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* SUBMISSION - two equal paths */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            type="submit"
            variant="primary"
            className={`w-full ${!canSubmit ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {status === "sending" ? "Sending..." : "Send My Custom Package Request"}
          </Button>

          <a
            href={hasFoundation ? whatsappHref : undefined}
            onClick={hasFoundation ? handleWhatsApp : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!hasFoundation}
            className={`inline-flex w-full items-center justify-center gap-2 rounded border-2 border-gold px-6 py-3 text-sm font-semibold tracking-wide text-gold transition-all duration-200 hover:bg-gold hover:text-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
              hasFoundation ? "" : "pointer-events-none opacity-60"
            }`}
          >
            Send It via WhatsApp
          </a>
        </div>

        {!hasFoundation && (
          <p className="text-center text-xs text-midnight/50">
            Choose a foundation to enable both submission options.
          </p>
        )}

        {status === "error" && (
          <p className="text-center text-sm font-medium text-red-600">
            Something went wrong. Please try again or email us directly at
            info@revolutionmedia.agency.
          </p>
        )}
      </form>

      <p className="mt-8 text-center text-sm leading-relaxed text-midnight/60">
        Every custom package includes the tracking and reporting standards we&apos;re
        known for: real conversions, not vanity metrics.
      </p>
    </div>
  );
}
