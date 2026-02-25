import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Revolution Media story — how a passion for hospitality and frustration with generic agencies led us to build a marketing partner made exclusively for hotels, resorts, and travel brands.",
};

export default function AboutPage() {
  return (
    <>
      {/* --- Hero --- */}
      <Hero
        size="medium"
        title="Where Strategy Meets Hospitality"
        subtitle="We started Revolution Media with one conviction: hospitality brands deserve a marketing partner that actually understands their world."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
      />

      {/* --- Our Story --- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container className="max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
              Our Story
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-midnight/70">
              <p>
                Revolution Media was founded after years of watching independent
                hotels and resorts hand their budgets to generic digital agencies
                — agencies that ran the same playbook for dentists, e-commerce
                stores, and five-star properties alike. The results were
                predictable: wasted spend, irrelevant strategies, and an
                ever-growing dependence on OTAs that kept eating into margins.
              </p>
              <p>
                We knew there had to be a better way. Hospitality is not a
                commodity — it is seasonal, experience-driven, and fiercely
                competitive. It demands a marketing partner who understands rate
                parity, shoulder-season strategy, and the difference between a
                booking and a browser. So we built one.
              </p>
              <p>
                Today, Revolution Media works exclusively with travel and
                hospitality brands worldwide. Every strategy we craft, every
                campaign we launch, and every metric we chase ties directly to
                the numbers that matter most to your bottom line: direct
                bookings, average daily rate, and guest lifetime value.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Why Hospitality --- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
                Why Hospitality
              </p>
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                Built for This Industry
              </h2>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <FadeIn delay={0}>
              <div className="rounded-lg bg-warm-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-midnight">
                  We Understand Seasonality
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-midnight/60">
                  Tourism doesn't follow a flat demand curve. We plan campaigns
                  around peak seasons, shoulder periods, and off-season
                  opportunities — so your budget works harder when it matters
                  most and stays efficient when demand dips.
                </p>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.1}>
              <div className="rounded-lg bg-warm-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-midnight">
                  We Speak Your Language
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-midnight/60">
                  OTA commission structures, ADR, RevPAR, direct-booking ratios
                  — these aren't buzzwords to us, they're the metrics we optimise
                  against every day. You'll never have to explain your business
                  model before a strategy session.
                </p>
              </div>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.2}>
              <div className="rounded-lg bg-warm-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-midnight">
                  Your Property Is Our Only Focus
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-midnight/60">
                  We don't juggle campaigns for SaaS startups in the morning and
                  hotels in the afternoon. Hospitality is all we do, which means
                  every insight, benchmark, and creative decision is rooted in
                  the realities of your industry.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* --- Credentials --- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="grid gap-8 sm:grid-cols-3 text-center">
              <div>
                <p className="text-4xl font-bold text-gold sm:text-5xl">50+</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-midnight/60">
                  Properties Served
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gold sm:text-5xl">12+</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-midnight/60">
                  Countries
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gold sm:text-5xl">8.5x</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-midnight/60">
                  Average ROAS
                </p>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- CTA Banner --- */}
      <CTABanner
        variant="dark"
        title="Let's Talk About Your Property"
        subtitle="Book a no-obligation discovery call and find out what a specialist hospitality agency can do for your direct bookings."
      />
    </>
  );
}
