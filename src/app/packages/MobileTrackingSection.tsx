"use client";

import { useState } from "react";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 flex-shrink-0 text-midnight/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const problemMetrics = [
  "Scroll depth",
  "Total page clicks",
  "Impressions & reach",
  "Total ad spend",
  "Page views",
  "Follower count",
  "Post engagement rate",
  "Generic session data",
];

const conversions = [
  "Direct booking link clicks",
  "Form submissions & enquiries",
  "Click-to-call tracking",
  "Click-to-email tracking",
  "Click-to-WhatsApp / chatbot",
  "GBP actions (calls, directions, website visits)",
  "Click-through rate (CTR) by campaign",
  "Return on ad spend (ROAS)",
];

const insights = [
  { metric: "Cost Per Acquisition (CPA)", desc: "How much it costs to acquire each guest" },
  { metric: "Cost Per Lead (CPL)", desc: "What you pay for each enquiry or call" },
  { metric: "Customer Lifetime Value (LTV)", desc: "The long-term revenue value of each guest" },
  { metric: "Revenue Per Channel", desc: "Which marketing channel drives the most bookings" },
  { metric: "Cross-Channel Attribution", desc: "How channels work together to convert guests" },
  { metric: "True ROAS", desc: "Real return on every rand spent on advertising" },
];

interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionSection({ title, icon, children, defaultOpen = false }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-midnight/10 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm font-bold text-midnight">{title}</span>
        </div>
        <ChevronDown open={open} />
      </button>
      {open && (
        <div className="border-t border-midnight/10 px-5 pb-5 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function MobileTrackingSection() {
  return (
    <div className="space-y-3 md:hidden">
      {/* The Problem */}
      <AccordionSection
        title="The Problem With Most Agency Reporting"
        defaultOpen
        icon={
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-red-500">
              <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
          </span>
        }
      >
        <p className="mb-3 text-sm leading-relaxed text-midnight/70">
          Many agencies use default analytics metrics as their key performance indicators. These are useful as supplementary data, but when presented as your main conversions, they paint a misleading picture.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {problemMetrics.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 flex-shrink-0 text-red-400">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Conversions We Track */}
      <AccordionSection
        title="The Conversions We Track"
        icon={
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          </span>
        }
      >
        <p className="mb-3 text-sm leading-relaxed text-midnight/60">
          We still report social metrics; they matter for growth. But our key conversions are tied to real business actions:
        </p>
        <ul className="space-y-2">
          {conversions.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-midnight/70">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </AccordionSection>

      {/* Insights This Unlocks */}
      <AccordionSection
        title="The Insights This Unlocks"
        icon={
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold">
              <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 7a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10 7ZM4.5 12A1.5 1.5 0 0 0 3 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 4.5 12Z" />
            </svg>
          </span>
        }
      >
        <p className="mb-3 text-sm leading-relaxed text-midnight/60">
          When you track real conversions, you can measure what actually matters:
        </p>
        <ul className="space-y-2">
          {insights.map((item) => (
            <li key={item.metric} className="rounded bg-gold/5 px-3 py-2">
              <span className="text-sm font-semibold text-midnight">{item.metric}</span>
              <p className="mt-0.5 text-xs text-midnight/50">{item.desc}</p>
            </li>
          ))}
        </ul>
      </AccordionSection>

      <p className="text-center text-xs leading-relaxed text-midnight/60">
        We set up proper analytics infrastructure on day one (GA4, Google Tag Manager, and custom event tracking), so every click, call, and form submission is captured.
      </p>
    </div>
  );
}
