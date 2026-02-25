"use client";

import { Button } from "@/components/ui/Button";

/* ------------------------------------------------------------------ */
/*  Table data — matches the PDF comparison grid                       */
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

function CellContent({ value }: { value: CellValue }) {
  if (value === true) return <CheckMark />;
  if (value === false) return <span className="text-midnight/30">—</span>;
  return <span>{value}</span>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PackagesTable() {
  return (
    <div className="space-y-8">
      {/* Scrollable table */}
      <div className="overflow-x-auto rounded-lg border border-midnight/10 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-sm">
          {/* Header */}
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

          {/* Body */}
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
          </tbody>
        </table>
      </div>

      {/* CTA row — one button per package */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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

      <p className="text-center text-sm text-midnight/50">
        Not sure which package is right for you?{" "}
        <a
          href="/contact"
          className="font-medium text-gold underline underline-offset-2 hover:text-deep-gold"
        >
          Book a free discovery call
        </a>{" "}
        and we&apos;ll help you choose.
      </p>
    </div>
  );
}
