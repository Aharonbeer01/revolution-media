"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Service {
  title: string;
  description: string;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-5 w-5 flex-shrink-0 text-soft-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function MobileOneTimeServices({
  services,
}: {
  services: Service[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 md:hidden">
      {services.map((service, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={service.title}
            className="rounded-lg border border-gold/20 bg-deep-black shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <h3 className="text-sm font-semibold text-gold">
                {service.title}
              </h3>
              <ChevronDown open={isOpen} />
            </button>
            {isOpen && (
              <div className="border-t border-gold/10 px-5 pb-5 pt-3">
                <p className="mb-4 text-xs leading-relaxed text-soft-white/50">
                  {service.description}
                </p>
                <Button
                  href="/contact"
                  variant="secondary"
                  className="w-full text-xs"
                >
                  Enquire
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
