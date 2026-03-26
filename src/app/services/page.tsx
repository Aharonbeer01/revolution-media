import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service hospitality marketing services, from strategy and paid ads to social media, content creation, SEO, and email marketing, built to drive direct bookings for independent properties.",
};

const steps = [
  {
    number: "01",
    title: "Audit",
    description:
      "We analyse your current marketing, website, and competitive landscape to uncover what is working, what is not, and where the biggest opportunities sit.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "We build a custom plan aligned to your revenue goals, mapping channels, audiences, creative direction, and budget to a clear 90-day roadmap.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "We implement across the right channels with hospitality-specific creative that speaks directly to the guests you want to attract.",
  },
  {
    number: "04",
    title: "Optimise",
    description:
      "We continuously refine based on data to maximise your return, adjusting bids, creative, targeting, and messaging to keep improving results.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Hero
        size="medium"
        eyebrow="WHAT WE DO"
        title="Services Built for Hospitality Growth"
        subtitle="Full-service digital marketing for independent hotels, lodges, and hospitality properties. Every service designed to turn online visibility into direct bookings and revenue."
        primaryCTA={{ label: "Get in Touch", href: "/contact" }}
      />

      <ServiceGrid showHeading={false} />

      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
              Our Approach
            </h2>
            <p className="mt-4 max-w-2xl text-midnight/60">
              Every engagement follows the same proven framework, so nothing is
              left to guesswork and every dollar you invest works harder.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <FadeIn key={step.number} delay={Number(step.number) * 0.1}>
                <div className="rounded-lg bg-warm-white p-6 shadow-sm">
                  <span className="text-3xl font-bold text-gold">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-midnight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-midnight/60">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        variant="gold"
        title="Ready to Fill More Rooms?"
        subtitle="Let's talk about how we can drive more direct bookings for your property."
      />
    </>
  );
}
