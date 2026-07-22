"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * Advanced OTA commission calculator used on the standalone tool page.
 *
 * On top of the simple homepage version, this variant models:
 *  - reporting currency (display only; commission is a percentage, not FX)
 *  - regional commission adjustments (OTA power varies by market)
 *  - a per-platform booking mix instead of an even split
 *  - a premium-placement / visibility programme surcharge
 *  - typical payout delays and the resulting cash tied up in the pipeline
 *  - a direct-booking shift scenario showing commission that could be saved
 *
 * Everything runs client-side; there is no persistence or network call.
 */

interface Ota {
  id: string;
  name: string;
  rate: number; // typical commission as a decimal
  payoutDays: number; // typical days from checkout to payout
  premiumEligible: boolean; // offers a visibility/placement programme
}

// Typical published OTA commission rates and payout windows (mid-range
// industry figures). Actual terms vary by contract and market.
const OTAS: Ota[] = [
  { id: "booking", name: "Booking.com", rate: 0.15, payoutDays: 30, premiumEligible: true },
  { id: "expedia", name: "Expedia", rate: 0.18, payoutDays: 45, premiumEligible: true },
  { id: "airbnb", name: "Airbnb", rate: 0.15, payoutDays: 2, premiumEligible: false },
  { id: "agoda", name: "Agoda", rate: 0.2, payoutDays: 40, premiumEligible: true },
  { id: "hotels", name: "Hotels.com", rate: 0.18, payoutDays: 45, premiumEligible: true },
  { id: "trivago", name: "Trivago", rate: 0.15, payoutDays: 30, premiumEligible: false },
  { id: "vrbo", name: "Vrbo", rate: 0.08, payoutDays: 7, premiumEligible: false },
  { id: "tripadvisor", name: "Tripadvisor", rate: 0.15, payoutDays: 35, premiumEligible: false },
];

interface Currency {
  code: string;
  label: string;
  locale: string;
}

// Reporting currencies. Commission is a percentage of revenue, so the choice
// affects presentation only; we do not convert between currencies.
const CURRENCIES: Currency[] = [
  { code: "USD", label: "US Dollar ($)", locale: "en-US" },
  { code: "EUR", label: "Euro (\u20AC)", locale: "en-IE" },
  { code: "GBP", label: "British Pound (\u00A3)", locale: "en-GB" },
  { code: "ZAR", label: "South African Rand (R)", locale: "en-ZA" },
  { code: "AUD", label: "Australian Dollar (A$)", locale: "en-AU" },
  { code: "AED", label: "UAE Dirham (\u062F.\u0625)", locale: "en-AE" },
];

interface Region {
  id: string;
  name: string;
  // Adjustment applied to the blended OTA rate. Markets with stronger OTA
  // leverage or heavier reliance on premium placement carry higher effective
  // commissions; regulated markets tend to sit lower.
  adjustment: number;
  note: string;
}

const REGIONS: Region[] = [
  {
    id: "europe",
    name: "Europe (EU)",
    adjustment: -0.01,
    note: "Regulated commission caps and strong direct-booking habits keep effective rates slightly lower.",
  },
  {
    id: "uk",
    name: "UK & Ireland",
    adjustment: 0,
    note: "Effective commissions sit close to the published industry average.",
  },
  {
    id: "north-america",
    name: "North America",
    adjustment: 0.01,
    note: "Competitive metasearch and premium placement nudge effective rates above the base average.",
  },
  {
    id: "middle-east",
    name: "Middle East",
    adjustment: 0.015,
    note: "High reliance on OTAs for inbound travel raises the effective commission you pay.",
  },
  {
    id: "africa",
    name: "Africa",
    adjustment: 0.025,
    note: "Heavier OTA dependency and premium visibility fees push effective commissions well above average.",
  },
  {
    id: "asia-pacific",
    name: "Asia-Pacific",
    adjustment: 0.02,
    note: "Aggressive OTA competition and placement auctions raise the real cost of each booking.",
  },
  {
    id: "latin-america",
    name: "Latin America",
    adjustment: 0.015,
    note: "Growing OTA dominance lifts effective commissions above the global average.",
  },
];

// Additional load applied to premium-eligible platforms when the visibility
// programme toggle is on (e.g. Booking.com Genius, Preferred Partner).
const PREMIUM_SURCHARGE = 0.05;

const inputStyles =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const selectStyles = inputStyles + " appearance-none";

const labelStyles = "mb-1 block text-sm font-medium text-midnight";

function useCurrencyFormatter(currency: Currency) {
  return useMemo(
    () =>
      new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        maximumFractionDigits: 0,
      }),
    [currency],
  );
}

export function AdvancedOtaCalculator() {
  const [rooms, setRooms] = useState("12");
  const [adr, setAdr] = useState("150");
  const [occupancy, setOccupancy] = useState("65");
  const [otaShare, setOtaShare] = useState("60"); // % of all bookings via OTAs
  const [selected, setSelected] = useState<string[]>(["booking", "expedia"]);
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [regionId, setRegionId] = useState("uk");
  const [premium, setPremium] = useState(false);
  const [directShift, setDirectShift] = useState("25"); // % of OTA bookings to move direct

  const currency =
    CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[1];
  const money = useCurrencyFormatter(currency);

  function toggleOta(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const result = useMemo(() => {
    const roomsN = Math.max(0, Number(rooms) || 0);
    const adrN = Math.max(0, Number(adr) || 0);
    const occN = Math.min(100, Math.max(0, Number(occupancy) || 0)) / 100;
    const otaShareN = Math.min(100, Math.max(0, Number(otaShare) || 0)) / 100;
    const directShiftN =
      Math.min(100, Math.max(0, Number(directShift) || 0)) / 100;

    // Annual room revenue = rooms * nightly rate * occupancy * 365 nights.
    const annualRevenue = roomsN * adrN * occN * 365;
    // Portion of revenue that flows through OTAs.
    const otaRevenue = annualRevenue * otaShareN;

    const chosen = OTAS.filter((o) => selected.includes(o.id));

    // Even split across the selected platforms for the blended figures.
    const baseRate =
      chosen.length > 0
        ? chosen.reduce((sum, o) => {
            const withPremium =
              premium && o.premiumEligible
                ? o.rate + PREMIUM_SURCHARGE
                : o.rate;
            return sum + withPremium;
          }, 0) / chosen.length
        : 0;

    // Apply the regional adjustment, floored at zero.
    const blendedRate = Math.max(0, baseRate + region.adjustment);

    const annualCommission = otaRevenue * blendedRate;
    const monthlyCommission = annualCommission / 12;

    // Weighted average payout delay across the selected platforms.
    const avgPayoutDays =
      chosen.length > 0
        ? Math.round(
            chosen.reduce((sum, o) => sum + o.payoutDays, 0) / chosen.length,
          )
        : 0;

    // Rough estimate of revenue sitting in the payout pipeline at any moment:
    // daily OTA revenue multiplied by the average payout delay.
    const dailyOtaRevenue = otaRevenue / 365;
    const cashInPipeline = dailyOtaRevenue * avgPayoutDays;

    // Direct-booking shift scenario: commission avoided on the shifted share.
    const commissionSaved = annualCommission * directShiftN;

    return {
      annualRevenue,
      otaRevenue,
      blendedRate,
      annualCommission,
      monthlyCommission,
      avgPayoutDays,
      cashInPipeline,
      commissionSaved,
      directShiftPct: Math.round(directShiftN * 100),
      hasInput:
        roomsN > 0 &&
        adrN > 0 &&
        occN > 0 &&
        otaShareN > 0 &&
        chosen.length > 0,
    };
  }, [
    rooms,
    adr,
    occupancy,
    otaShare,
    selected,
    region,
    premium,
    directShift,
  ]);

  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Advanced Commission Calculator"
          title="Model Your True OTA Cost"
          subtitle="Adjust for your currency, region, platform mix and payout terms to see the full picture, including the cash tied up waiting for OTA payouts."
        />

        <FadeIn>
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">
            {/* --- Inputs --- */}
            <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-8 lg:col-span-3">
              {/* Property basics */}
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="aota-rooms" className={labelStyles}>
                    Rooms
                  </label>
                  <input
                    id="aota-rooms"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="aota-adr" className={labelStyles}>
                    Avg nightly rate
                  </label>
                  <input
                    id="aota-adr"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={adr}
                    onChange={(e) => setAdr(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="aota-occupancy" className={labelStyles}>
                    Occupancy (%)
                  </label>
                  <input
                    id="aota-occupancy"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>

              {/* Currency + region */}
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="aota-currency" className={labelStyles}>
                    Reporting currency
                  </label>
                  <select
                    id="aota-currency"
                    value={currencyCode}
                    onChange={(e) => setCurrencyCode(e.target.value)}
                    className={selectStyles}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="aota-region" className={labelStyles}>
                    Region
                  </label>
                  <select
                    id="aota-region"
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value)}
                    className={selectStyles}
                  >
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-2 text-xs text-warm-gray">{region.note}</p>

              {/* OTA share */}
              <div className="mt-6">
                <label htmlFor="aota-share" className={labelStyles}>
                  Share of bookings through OTAs:{" "}
                  <span className="font-semibold text-gold">{otaShare}%</span>
                </label>
                <input
                  id="aota-share"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={otaShare}
                  onChange={(e) => setOtaShare(e.target.value)}
                  className="w-full accent-gold"
                />
              </div>

              {/* Platform selection */}
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-medium text-midnight">
                  Which platforms do you sell through?
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {OTAS.map((ota) => {
                    const checked = selected.includes(ota.id);
                    const displayRate =
                      premium && ota.premiumEligible
                        ? ota.rate + PREMIUM_SURCHARGE
                        : ota.rate;
                    return (
                      <label
                        key={ota.id}
                        className={`flex cursor-pointer items-center justify-between rounded border px-4 py-3 text-sm transition-colors ${
                          checked
                            ? "border-gold bg-gold/10 text-midnight"
                            : "border-midnight/10 bg-warm-white text-midnight/70 hover:border-gold/50"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOta(ota.id)}
                            className="h-4 w-4 rounded border-midnight/20 text-gold accent-gold focus:ring-gold"
                          />
                          <span className="font-medium">{ota.name}</span>
                        </span>
                        <span className="text-xs text-midnight/50">
                          {Math.round(displayRate * 100)}% &middot; {ota.payoutDays}d
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Premium placement toggle */}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={premium}
                  onChange={() => setPremium((p) => !p)}
                  className="mt-0.5 h-4 w-4 rounded border-midnight/20 text-gold accent-gold focus:ring-gold"
                />
                <span>
                  <span className="font-medium text-midnight">
                    I use visibility programmes (Genius, Preferred, etc.)
                  </span>
                  <span className="mt-0.5 block text-xs text-midnight/50">
                    Adds roughly {Math.round(PREMIUM_SURCHARGE * 100)}% on
                    eligible platforms for premium placement.
                  </span>
                </span>
              </label>

              {/* Direct-shift scenario */}
              <div className="mt-6">
                <label htmlFor="aota-direct" className={labelStyles}>
                  If you moved{" "}
                  <span className="font-semibold text-gold">{directShift}%</span>{" "}
                  of OTA bookings direct
                </label>
                <input
                  id="aota-direct"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={directShift}
                  onChange={(e) => setDirectShift(e.target.value)}
                  className="w-full accent-gold"
                />
              </div>
            </div>

            {/* --- Result --- */}
            <div className="flex flex-col justify-center rounded-lg bg-midnight dark-texture p-6 text-center shadow-sm sm:p-8 lg:col-span-2">
              {result.hasInput ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
                    You are paying roughly
                  </p>
                  <p className="mt-3 text-4xl font-bold text-soft-white sm:text-5xl">
                    {money.format(result.annualCommission)}
                  </p>
                  <p className="mt-1 text-sm text-soft-white/60">
                    per year in OTA commission
                  </p>

                  <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />

                  {/* Key figures */}
                  <dl className="mt-6 space-y-3 text-left text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-soft-white/60">Per month</dt>
                      <dd className="font-semibold text-soft-white">
                        {money.format(result.monthlyCommission)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-soft-white/60">
                        Blended effective rate
                      </dt>
                      <dd className="font-semibold text-soft-white">
                        {Math.round(result.blendedRate * 100)}%
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-soft-white/60">Est. OTA revenue</dt>
                      <dd className="font-semibold text-soft-white">
                        {money.format(result.otaRevenue)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-soft-white/60">Avg payout delay</dt>
                      <dd className="font-semibold text-soft-white">
                        {result.avgPayoutDays} days
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-soft-white/60">Cash in pipeline</dt>
                      <dd className="font-semibold text-soft-white">
                        {money.format(result.cashInPipeline)}
                      </dd>
                    </div>
                  </dl>

                  {/* Direct-shift saving */}
                  {result.directShiftPct > 0 && (
                    <div className="mt-6 rounded border border-gold/30 bg-gold/10 p-4">
                      <p className="text-xs uppercase tracking-[0.1em] text-gold">
                        Shift {result.directShiftPct}% direct and save
                      </p>
                      <p className="mt-1 text-2xl font-bold text-soft-white">
                        {money.format(result.commissionSaved)}
                        <span className="text-sm font-normal text-soft-white/60">
                          {" "}
                          / year
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant="primary"
                      data-track="advanced_ota_calculator_cta"
                    >
                      Book a Discovery Call
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-soft-white/60">
                  Enter your property details, set your OTA share and select at
                  least one platform to see your true annual commission cost.
                </p>
              )}
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-warm-gray">
            Estimates use typical published commission rates, payout windows and
            regional adjustments. Currency is for reporting only and no exchange
            conversion is applied. Your actual rates, mix and terms will vary by
            contract.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
