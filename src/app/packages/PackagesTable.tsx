"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ */
/*  Market Segment data                                                */
/* ------------------------------------------------------------------ */

/* SVG icons for market segments */
function BoutiqueIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold">
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 21h18" />
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
      <path d="M9 7h1" />
      <path d="M14 7h1" />
    </svg>
  );
}

function MediumPropertyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function LargePropertyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function EnterpriseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gold">
      <path d="M2 22h20" />
      <path d="M9 22V2h6v20" />
      <path d="M1 22V12a1 1 0 0 1 1-1h5" />
      <path d="M17 22V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14" />
      <path d="M11 6h2" />
      <path d="M11 10h2" />
      <path d="M11 14h2" />
      <path d="M11 18h2" />
    </svg>
  );
}

const segments = [
  {
    title: "Boutique Property",
    subtitle: "Up to 10 rooms",
    description:
      "You need visibility and a consistent online presence. Build brand awareness, attract direct bookings, and establish your digital footprint.",
    recommended: ["Visibility", "Foundation"],
    icon: BoutiqueIcon,
  },
  {
    title: "Medium-Sized Property",
    subtitle: "10–50 rooms",
    description:
      "You need growth-focused marketing. Scale your reach, run targeted campaigns, and start reducing OTA dependency with a dedicated strategy.",
    recommended: ["Foundation", "Growth"],
    icon: MediumPropertyIcon,
  },
  {
    title: "Large Property",
    subtitle: "50–150 rooms",
    description:
      "You need performance at scale. Multi-platform management, paid advertising, content strategy, and data-driven optimisation across all channels.",
    recommended: ["Performance", "Total Rev."],
    icon: LargePropertyIcon,
  },
  {
    title: "Enterprise / Group",
    subtitle: "150+ rooms or multi-property",
    description:
      "You need a full-service digital partner. Total revenue management across every touchpoint — social, search, email, paid media, and reporting.",
    recommended: ["Total Rev."],
    icon: EnterpriseIcon,
  },
];

/* ------------------------------------------------------------------ */
/*  Package detail data for accordions                                  */
/* ------------------------------------------------------------------ */

interface PackageDetail {
  name: string;
  tagline: string;
  isBoost?: boolean;
  features: string[];
  tracking: string[];
}

const packageDetails: PackageDetail[] = [
  {
    name: "Visibility",
    tagline: "Build awareness and establish your online presence",
    features: [
      "8 social posts per month",
      "12 stories per month",
      "Reel editing included",
      "1–2 platforms managed",
      "Monthly performance report",
      "Monthly strategy call",
    ],
    tracking: [
      "GA4 & GTM setup",
      "Click-to-call, email & WhatsApp tracking",
      "Monthly KPI report (CTR, reach, engagement)",
    ],
  },
  {
    name: "Boost",
    tagline: "Paid advertising only — amplify your reach",
    isBoost: true,
    features: [
      "1 ad campaign managed",
      "3 ad sets per campaign",
      "Retargeting included",
      "Bi-monthly performance report",
      "Bi-monthly strategy call",
      "Can be added to any organic package",
    ],
    tracking: [
      "GA4 & GTM setup",
      "Conversion tracking (form submissions, calls, emails)",
      "Ad platform tracking (CTR, CPC, ROAS)",
      "Bi-monthly KPI report with cost per lead",
    ],
  },
  {
    name: "Foundation",
    tagline: "Organic marketing with GBP optimisation",
    features: [
      "12 social posts per month",
      "16 stories per month",
      "Reel editing included",
      "2–3 platforms managed",
      "Google Business Profile management",
      "Bi-monthly performance report",
      "Bi-monthly strategy call",
    ],
    tracking: [
      "GA4 & GTM setup",
      "Click-to-call, email & WhatsApp tracking",
      "GBP insights (search queries, direction requests, calls)",
      "Bi-monthly KPI report (CTR, reach, direct booking clicks)",
    ],
  },
  {
    name: "Growth",
    tagline: "Organic + paid for scaling properties",
    features: [
      "12 social posts per month",
      "16 stories per month",
      "Reel editing included",
      "2–3 platforms managed",
      "Google Business Profile management",
      "1 ad campaign with 3 ad sets",
      "Retargeting included",
      "Weekly strategy calls",
      "Monthly performance report",
    ],
    tracking: [
      "GA4 & GTM setup with custom events",
      "Conversion tracking (forms, calls, emails, WhatsApp)",
      "Ad platform tracking (CTR, CPC, ROAS)",
      "GBP insights (search queries, direction requests, calls)",
      "Monthly KPI report with cost per lead & booking attribution",
    ],
  },
  {
    name: "Performance",
    tagline: "Multi-channel marketing with content and ads",
    features: [
      "16 social posts per month",
      "20 stories per month",
      "Reel editing included",
      "3–4 platforms managed",
      "Google Business Profile management",
      "2 blog posts per month",
      "2 ad campaigns with 3 ad sets each",
      "Retargeting included",
      "Weekly strategy calls",
      "Monthly report + quarterly review",
    ],
    tracking: [
      "GA4 & GTM setup with custom events",
      "Full conversion tracking (forms, calls, emails, WhatsApp, chatbot)",
      "Multi-platform ad tracking (CTR, CPC, CPL, ROAS)",
      "GBP insights (search queries, direction requests, calls)",
      "Cross-channel attribution reporting",
      "Monthly KPI report + quarterly deep-dive review",
    ],
  },
  {
    name: "Total Rev.",
    tagline: "Full-service digital marketing across every channel",
    features: [
      "16 social posts per month",
      "24 stories per month",
      "Reel editing included",
      "5–8 platforms managed",
      "Google Business Profile management",
      "4 blog posts per month",
      "Email marketing included",
      "2+ ad campaigns with 5 ad sets each",
      "Retargeting included",
      "Bi-weekly strategy calls",
      "Monthly report + quarterly review",
    ],
    tracking: [
      "GA4 & GTM setup with custom events",
      "Full conversion tracking (forms, calls, emails, WhatsApp, chatbot)",
      "Multi-platform ad tracking (CTR, CPC, CPL, ROAS)",
      "GBP insights (search queries, direction requests, calls)",
      "Cross-channel attribution reporting",
      "Revenue attribution per marketing channel",
      "Monthly KPI report + quarterly deep-dive review",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Comparison table data                                               */
/* ------------------------------------------------------------------ */

const packages = [
  "Visibility",
  "Boost",
  "Foundation",
  "Growth",
  "Performance",
  "Total Rev.",
] as const;

type CellValue = string | boolean;

interface Row {
  label: string;
  values: CellValue[];
}

const rows: Row[] = [
  { label: "Social posts/mo", values: ["8", "—", "12", "12", "16", "16"] },
  { label: "Stories/mo", values: ["12", "—", "16", "16", "20", "24"] },
  { label: "Reel editing", values: [true, false, true, true, true, true] },
  { label: "Platforms managed", values: ["1–2", "—", "2–3", "2–3", "3–4", "5–8"] },
  { label: "Google Business Profile", values: [false, false, true, true, true, true] },
  { label: "Blog posts/mo", values: ["—", "—", "—", "—", "2", "4"] },
  { label: "Email marketing", values: [false, false, false, false, false, true] },
  { label: "Ad campaigns", values: ["—", "1", "—", "1", "2", "2+"] },
  { label: "Ad sets / campaign", values: ["—", "3", "—", "3", "3", "5"] },
  { label: "Retargeting", values: [false, true, false, true, true, true] },
  { label: "Monthly report", values: [true, true, true, true, true, true] },
  { label: "Strategy calls", values: ["Monthly", "Bi-Monthly", "Bi-Monthly", "Weekly", "Weekly", "Bi-weekly"] },
  { label: "Quarterly review", values: [false, false, false, false, true, true] },
];

const trackingRows: Row[] = [
  { label: "GA4 & GTM setup", values: [true, true, true, true, true, true] },
  { label: "Click-to-call/email/WhatsApp", values: [true, true, true, true, true, true] },
  { label: "Form submission tracking", values: [false, true, false, true, true, true] },
  { label: "GBP insights", values: [false, false, true, true, true, true] },
  { label: "Ad performance (CTR, CPC, ROAS)", values: [false, true, false, true, true, true] },
  { label: "Cost per lead reporting", values: [false, true, false, true, true, true] },
  { label: "Cross-channel attribution", values: [false, false, false, false, true, true] },
  { label: "Revenue attribution per channel", values: [false, false, false, false, false, true] },
];

/* ------------------------------------------------------------------ */
/*  Render helpers                                                     */
/* ------------------------------------------------------------------ */

function CheckMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mx-auto h-4 w-4 text-green-600"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrackingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-deep"
    >
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 7a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10 7ZM4.5 12A1.5 1.5 0 0 0 3 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 4.5 12Z" />
    </svg>
  );
}

function CellContent({ value }: { value: CellValue }) {
  if (value === true) return <CheckMark />;
  if (value === false) return <span className="text-midnight/30">—</span>;
  return <span>{value}</span>;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion Item                                                     */
/* ------------------------------------------------------------------ */

function PackageAccordion({ pkg }: { pkg: PackageDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-midnight/10 bg-white shadow-sm transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-midnight">{pkg.name}</h3>
            {pkg.isBoost && (
              <span className="rounded-full bg-midnight/10 px-3 py-0.5 text-xs font-semibold text-midnight/60">
                PAID ADS ONLY
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-warm-gray">{pkg.tagline}</p>
        </div>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div className="border-t border-midnight/10 px-6 pb-6 pt-4">
          <ul className="grid gap-2 sm:grid-cols-2">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-midnight/80">
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-md border border-gold/20 bg-gold/5 px-5 py-4">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-deep">
              Tracking & Reporting
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {pkg.tracking.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-midnight/80">
                  <TrackingIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <Button href="/contact" variant="primary" className="text-sm">
              Get Started with {pkg.name}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function PackagesTable() {
  return (
    <div className="space-y-20">
      {/* ---- SECTION 1: Find Your Fit ---- */}
      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((seg) => (
            <div
              key={seg.title}
              className="rounded-lg border border-midnight/10 bg-white p-6 shadow-sm"
            >
              <seg.icon />
              <h3 className="mt-3 text-lg font-bold text-midnight">{seg.title}</h3>
              <p className="text-sm font-medium text-gold-deep">{seg.subtitle}</p>
              <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                {seg.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {seg.recommended.map((pkg) => (
                  <span
                    key={pkg}
                    className="rounded-full bg-midnight px-3 py-1 text-xs font-semibold text-gold"
                  >
                    {pkg}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---- SECTION 2: Package Details (Accordions) ---- */}
      <div>
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.1em] text-gold-deep">
          PACKAGE DETAILS
        </h3>
        <p className="mb-8 text-center text-2xl font-bold text-midnight sm:text-3xl">
          Explore What&apos;s Included
        </p>

        <div className="mx-auto max-w-3xl space-y-3">
          {packageDetails.map((pkg) => (
            <PackageAccordion key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* ---- SECTION 3: Comparison Table (hidden on mobile) ---- */}
      <div className="hidden md:block">
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.1em] text-gold-deep">
          SIDE-BY-SIDE COMPARISON
        </h3>
        <p className="mb-8 text-center text-2xl font-bold text-midnight sm:text-3xl">
          Compare All Packages
        </p>

        <div className="overflow-x-auto rounded-lg border border-midnight/10 bg-white shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-midnight text-soft-white">
                <th className="px-4 py-3 text-left font-semibold" />
                {packages.map((name) => (
                  <th
                    key={name}
                    className="px-3 py-3 text-center font-semibold text-gold"
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-soft-white/50"}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-midnight">
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={`${row.label}-${j}`}
                      className="px-3 py-3 text-center text-midnight/80"
                    >
                      <CellContent value={val} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gold/10">
                <td
                  colSpan={7}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gold-deep"
                >
                  Tracking & Reporting
                </td>
              </tr>
              {trackingRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-gold/5" : "bg-white"}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-midnight">
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={`${row.label}-${j}`}
                      className="px-3 py-3 text-center text-midnight/80"
                    >
                      <CellContent value={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {packages.map((name) => (
            <Button
              key={name}
              href="/contact"
              variant="primary"
              className="w-full text-xs sm:text-sm"
            >
              {name}
            </Button>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-warm-gray">
          Not sure which package is right for you?{" "}
          <a
            href="/contact"
            className="font-medium text-gold-deep underline underline-offset-2 hover:text-gold"
          >
            Book a free discovery call
          </a>{" "}
          and we&apos;ll help you choose.
        </p>
      </div>
    </div>
  );
}
