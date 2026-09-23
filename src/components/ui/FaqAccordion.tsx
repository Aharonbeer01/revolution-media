"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 flex-shrink-0 text-gold transition-transform duration-200 ${
        open ? "rotate-45" : ""
      }`}
      aria-hidden="true"
    >
      <path d="M10 4a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 10 4Z" />
    </svg>
  );
}

/**
 * Accordion for on-page FAQ sections. Pair it with FAQPage JSON-LD built from
 * the same items so the rendered copy and the structured data always match.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-lg border border-midnight/10 bg-warm-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-midnight sm:text-base">
                {item.question}
              </span>
              <PlusIcon open={isOpen} />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm leading-relaxed text-midnight/70">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
