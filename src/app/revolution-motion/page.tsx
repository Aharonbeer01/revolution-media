import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { SlideUp } from "@/components/motion/SlideUp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Revolution Motion | Video Production for Hospitality",
  description:
    "Professional video production for hotels, lodges, and hospitality properties. Cinematic content that inspires guests to book direct.",
};

const contentTypes = [
  {
    title: "Hero & Brand Videos",
    description:
      "Cinematic property films that capture the essence of your guest experience and drive direct bookings.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    title: "Social Media Videos",
    description:
      "Scroll-stopping short-form content optimised for Instagram Reels, TikTok, and Facebook.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
        />
      </svg>
    ),
  },
  {
    title: "Mid-Form Content",
    description:
      "Engaging 1-3 minute videos perfect for website headers, YouTube, and email campaigns.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 12 6 12.504 6 13.125m-3.75 0c0-.621-.504-1.125-1.125-1.125"
        />
      </svg>
    ),
  },
  {
    title: "Guest-Facing Content",
    description:
      "Room tours, amenity showcases, and experience highlights that help guests visualise their stay.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-8 w-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
];

const packages = [
  {
    name: "Social Content Package",
    features: [
      "Half-day shoot",
      "8-10 short-form videos",
      "Edited and formatted for social platforms",
      "Delivered within 10 business days",
    ],
  },
  {
    name: "Content + Brand Package",
    features: [
      "Full-day shoot",
      "15-20 short-form videos",
      "2-3 mid-form brand videos",
      "Social + brand content combined",
      "Delivered within 15 business days",
    ],
  },
  {
    name: "Hero Video Package",
    features: [
      "Full-day shoot",
      "1 cinematic hero/brand video",
      "5 cutdown edits for social and web",
      "Includes pre-production planning",
      "Delivered within 15 business days",
    ],
  },
  {
    name: "Full Property Package",
    features: [
      "1.5-2 day shoot",
      "Complete video content library",
      "Hero video + social content + mid-form",
      "Full pre-production and creative direction",
      "Delivered within 20 business days",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Brief",
    description: "We learn about your property, brand, and goals",
  },
  {
    number: "02",
    title: "Pre-Production",
    description: "Shot lists, schedules, and creative direction",
  },
  {
    number: "03",
    title: "Production",
    description: "On-location filming with our professional crew",
  },
  {
    number: "04",
    title: "Post-Production",
    description: "Editing, colour grading, and sound design",
  },
  {
    number: "05",
    title: "Review",
    description: "Collaborative feedback and revisions",
  },
  {
    number: "06",
    title: "Delivery",
    description: "Final files delivered in all required formats",
  },
];

const addOns = [
  "Drone/aerial footage",
  "Additional shoot days",
  "Photography + Video combo packages",
  "Express delivery",
  "Licensed music",
];

export default function RevolutionMotionPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        size="medium"
        eyebrow="REVOLUTION MOTION"
        title="Your Property Deserves to Be Seen"
        subtitle="Professional video production built for travel and hospitality. We create cinematic content that inspires guests to book direct."
        primaryCTA={{ label: "Book a Discovery Call", href: "/contact" }}
        secondaryCTA={{ label: "See Our Services", href: "/services" }}
      />

      {/* What We Produce */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="WHAT WE CREATE"
              title="Content That Converts"
            />
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {contentTypes.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="mb-4 text-gold">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-midnight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-midnight/60">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Packages */}
      <section className="bg-midnight py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="OUR PACKAGES"
              title="Tailored to Your Property"
              theme="dark"
            />
          </FadeIn>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg, index) => (
              <SlideUp key={pkg.name} delay={index * 0.1}>
                <div className="flex h-full flex-col rounded-lg border border-gold/30 bg-deep-black p-6">
                  <div className="mb-4 border-b border-gold/20 pb-4">
                    <h3 className="text-lg font-bold text-gold">{pkg.name}</h3>
                  </div>
                  <ul className="mb-6 flex-1 space-y-3">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-soft-white/70"
                      >
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
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button href="/contact" variant="secondary" className="w-full">
                    Get Started
                  </Button>
                </div>
              </SlideUp>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="OUR PROCESS"
              title="From Brief to Delivery"
            />
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <FadeIn key={step.number} delay={Number(step.number) * 0.08}>
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold text-lg font-bold text-midnight">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-midnight/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading eyebrow="ADD-ONS" title="Customise Your Package" />
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mx-auto max-w-2xl">
              <ul className="grid gap-3 sm:grid-cols-2">
                {addOns.map((addOn) => (
                  <li
                    key={addOn}
                    className="flex items-center gap-3 rounded-lg bg-white/60 px-4 py-3 text-midnight"
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
                    <span className="text-sm font-medium">{addOn}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-sm leading-relaxed text-midnight/60">
                All packages can be customised with add-ons to suit your
                property&apos;s needs.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        variant="gold"
        title="Ready to Showcase Your Property?"
        subtitle="Let's create content that turns viewers into guests."
      />
    </>
  );
}
