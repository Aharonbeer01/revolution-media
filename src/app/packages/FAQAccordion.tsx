"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
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

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="rounded-lg bg-white/60">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
            >
              <span className="font-semibold text-midnight pr-4">
                {item.question}
              </span>
              <ChevronDown open={isOpen} />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pt-0">
                <p className="text-sm leading-relaxed text-midnight/60">
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
