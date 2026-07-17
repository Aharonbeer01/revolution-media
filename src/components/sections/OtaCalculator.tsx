"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * OTA commission calculator. Visitors enter their rooms, average daily rate
 * and occupancy, then select the OTAs they sell through. Each OTA carries a
 * typical commission rate; the tool assumes an even split of OTA bookings
 * across the selected platforms and shows the resulting annual and monthly
 * commission cost, plus a call to action.
 */

interface Ota {
  id: string;
  name: string;
  rate: number; // typical commission as a decimal
}

// Typical published OTA commission rates (mid-range industry figures).
const OTAS: Ota[] = [
  { id: "booking", name: "Booking.com", rate: 0.15 },
  { id: "expedia", name: "Expedia", rate: 0.18 },
  { id: "airbnb", name: "Airbnb", rate: 0.15 },
  { id: "agoda", name: "Agoda", rate: 0.2 },
  { id: "hotels", name: "Hotels.com", rate: 0.18 },
];

const inputStyles =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const labelStyles = "mb-1 block text-sm font-medium text-midnight";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function OtaCalculator() {
  const [rooms, setRooms] = useState("12");
  const [adr, setAdr] = useState("150");
  const [occupancy, setOccupancy] = useState("65");
  const [selected, setSelected] = useState<string[]>(["booking"]);

  function toggleOta(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  const result = useMemo(() => {
    const roomsN = Math.max(0, Number(rooms) || 0);
    const adrN = Math.max(0, Number(adr) || 0);
    const occN = Math.min(100, Math.max(0, Number(occupancy) || 0)) / 100;

    // Annual room revenue = rooms * nightly rate * occupancy * 365 nights.
    const annualRevenue = roomsN * adrN * occN * 365;

    const chosen = OTAS.filter((o) => selected.includes(o.id));
    // Assume OTA bookings split evenly across the selected platforms, so the
    // effective commission on OTA revenue is the average of their rates.
    const blendedRate =
      chosen.length > 0
        ? chosen.reduce((sum, o) => sum + o.rate, 0) / chosen.length
        : 0;

    const annualCommission = annualRevenue * blendedRate;
    const monthlyCommission = annualCommission / 12;

    return {
      annualRevenue,
      blendedRate,
      annualCommission,
      monthlyCommission,
      hasInput: roomsN > 0 && adrN > 0 && occN > 0 && chosen.length > 0,
    };
  }, [rooms, adr, occupancy, selected]);

  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="What Are OTAs Costing You?"
          title="The OTA Commission Calculator"
          subtitle="Enter a few details about your property to see how much you hand to third-party booking platforms every year."
        />

        <FadeIn>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            {/* --- Inputs --- */}
            <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="ota-rooms" className={labelStyles}>
                    Rooms
                  </label>
                  <input
                    id="ota-rooms"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="ota-adr" className={labelStyles}>
                    Avg nightly rate ($)
                  </label>
                  <input
                    id="ota-adr"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={adr}
                    onChange={(e) => setAdr(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="ota-occupancy" className={labelStyles}>
                    Occupancy (%)
                  </label>
                  <input
                    id="ota-occupancy"
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

              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-medium text-midnight">
                  Which OTAs do you sell through?
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {OTAS.map((ota) => {
                    const checked = selected.includes(ota.id);
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
                          {Math.round(ota.rate * 100)}%
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            {/* --- Result --- */}
            <div className="flex flex-col justify-center rounded-lg bg-midnight dark-texture p-6 text-center shadow-sm sm:p-8">
              {result.hasInput ? (
                <>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
                    You are paying roughly
                  </p>
                  <p className="mt-3 text-4xl font-bold text-soft-white sm:text-5xl">
                    {usd.format(result.annualCommission)}
                  </p>
                  <p className="mt-1 text-sm text-soft-white/60">
                    per year in OTA commission
                  </p>

                  <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />

                  <p className="mt-6 text-sm text-soft-white/70">
                    That is{" "}
                    <span className="font-semibold text-soft-white">
                      {usd.format(result.monthlyCommission)}
                    </span>{" "}
                    every month, at a blended commission rate of{" "}
                    <span className="font-semibold text-soft-white">
                      {Math.round(result.blendedRate * 100)}%
                    </span>{" "}
                    on estimated OTA revenue of{" "}
                    <span className="font-semibold text-soft-white">
                      {usd.format(result.annualRevenue)}
                    </span>
                    .
                  </p>

                  <p className="mt-6 text-sm text-soft-white/70">
                    Reinvested into direct-booking marketing, that budget could
                    fund a full-year strategy to win those guests yourself.
                  </p>

                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant="primary"
                      data-track="ota_calculator_cta"
                    >
                      Book a Discovery Call
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-soft-white/60">
                  Enter your rooms, rate and occupancy, and select at least one
                  OTA to see your annual commission cost.
                </p>
              )}
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-warm-gray">
            Estimates use typical published OTA commission rates and assume an
            even split of OTA bookings across the platforms you select. Your
            actual rates and mix will vary.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}
