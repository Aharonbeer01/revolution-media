"use client";

import { useState } from "react";

interface Segment {
  title: string;
  subtitle: string;
  description: string;
  recommended: string[];
}

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

export function MobilePropertyCards({
  segments,
}: {
  segments: Segment[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 md:hidden">
      {segments.map((seg, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={seg.title}
            className="rounded-lg border border-midnight/10 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div>
                <h3 className="text-base font-bold text-midnight">
                  {seg.title}
                </h3>
                <p className="text-sm font-medium text-gold-deep">
                  {seg.subtitle}
                </p>
              </div>
              <ChevronDown open={isOpen} />
            </button>
            {isOpen && (
              <div className="border-t border-midnight/10 px-5 pb-5 pt-3">
                <p className="text-sm leading-relaxed text-warm-gray">
                  {seg.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
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
            )}
          </div>
        );
      })}
    </div>
  );
}
