"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Bundle {
  name: string;
  features: string[];
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

export function MobilePhotographyBundles({
  bundles,
  addOns,
}: {
  bundles: Bundle[];
  addOns: string[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [addOnsOpen, setAddOnsOpen] = useState(false);

  return (
    <div className="space-y-3 md:hidden">
      {bundles.map((pkg, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={pkg.name}
            className="rounded-lg border border-midnight/10 bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <h3 className="text-base font-bold text-midnight">{pkg.name}</h3>
              <ChevronDown open={isOpen} />
            </button>
            {isOpen && (
              <div className="border-t border-midnight/10 px-5 pb-5 pt-3">
                <ul className="mb-4 space-y-2">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-midnight/70"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/contact" variant="primary" className="w-full">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add-ons accordion */}
      <div className="rounded-lg border border-midnight/10 bg-white shadow-sm">
        <button
          onClick={() => setAddOnsOpen(!addOnsOpen)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <h3 className="text-base font-bold text-midnight">
            Photography Add-Ons
          </h3>
          <ChevronDown open={addOnsOpen} />
        </button>
        {addOnsOpen && (
          <div className="border-t border-midnight/10 px-5 pb-5 pt-3">
            <ul className="space-y-2">
              {addOns.map((addOn) => (
                <li
                  key={addOn}
                  className="flex items-center gap-2.5 text-sm text-midnight/70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 flex-shrink-0 text-gold"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {addOn}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
