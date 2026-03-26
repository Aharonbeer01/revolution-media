import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { SlideUp } from "@/components/motion/SlideUp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PackagesTable } from "./PackagesTable";
import { FAQAccordion } from "./FAQAccordion";
import { MobileTrackingSection } from "./MobileTrackingSection";
import { MobilePhotographyBundles } from "./MobilePhotographyBundles";
import { MobileOneTimeServices } from "./MobileOneTimeServices";

export const metadata: Metadata = {
  title: "Packages | Revolution Media: Digital Marketing for Hospitality",
  description:
    "Explore our monthly marketing packages, photography bundles, and one-time strategy services built exclusively for hotels, lodges, and hospitality businesses.",
};

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const photographyBundles = [
  {
    name: "Essential Shoot",
    features: [
      "Half-day on location",
      "30–40 edited images",
      "Colour-graded and brand-aligned",
      "Delivered within 10 business days",
    ],
  },
  {
    name: "Property Showcase",
    features: [
      "Full-day on location",
      "60–80 edited images",
      "3–5 short video clips",
      "Colour-graded and brand-aligned",
      "Delivered within 15 business days",
    ],
  },
  {
    name: "Complete Visual Identity",
    features: [
      "Two full days on location",
      "120–150 edited images",
      "8–10 short video clips",
      "Drone / aerial coverage",
      "Full pre-production & creative direction",
      "Delivered within 20 business days",
    ],
  },
  {
    name: "Seasonal Refresh",
    features: [
      "Half-day on location",
      "20–25 edited images",
      "Designed for quarterly updates",
      "Keep your content fresh and relevant",
    ],
  },
];

const photographyAddOns = [
  "Additional editing day",
  "Rush delivery (48-hour turnaround)",
  "Drone / aerial photography",
  "Food & beverage session",
  "Creative direction (available remotely for international clients)",
];

const oneTimeServices = [
  {
    title: "Digital Presence Audit",
    description:
      "Comprehensive review of your online footprint with actionable recommendations.",
  },
  {
    title: "Direct Booking Strategy",
    description:
      "Reduce OTA dependency and drive more guests to book directly.",
  },
  {
    title: "Content Calendar & Scripts",
    description:
      "3-month content calendar with post copy, hashtags, and video scripts.",
  },
  {
    title: "Ad Campaign Setup",
    description:
      "Full campaign setup across Google and/or Meta with conversion tracking.",
  },
  {
    title: "GBP Overhaul",
    description:
      "Complete optimisation of your Google Business Profile listing.",
  },
];

const faqItems = [
  {
    question: "Is there a minimum contract term?",
    answer:
      "Yes. All monthly packages run on a 3-month minimum commitment so we have time to build, optimise, and deliver results.",
  },
  {
    question: "What am I responsible for?",
    answer:
      "Timely approvals, access to your accounts and booking data, and supplying raw content when required (or booking a photography/video package with us).",
  },
  {
    question: "Is ad spend included?",
    answer:
      "No. Ad spend is paid directly to the advertising platforms (Google, Meta, TikTok). Our fees cover strategy, creative, management, and reporting.",
  },
  {
    question: "Do you build websites?",
    answer:
      "Not currently. We focus on marketing, advertising, content creation, and strategy. We can recommend trusted web development partners.",
  },
  {
    question: "What about SEO?",
    answer:
      "Our SEO work focuses on Google Business Profile optimisation, blog content strategy, and on-page improvements, not technical site audits.",
  },
  {
    question: "Can I upgrade my package?",
    answer:
      "Absolutely. You can upgrade at any time. Changes take effect from the next billing cycle.",
  },
  {
    question: "Are photography packages available internationally?",
    answer:
      "Photography and video production are currently available in South Africa only. Remote creative direction is available for international clients.",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

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

function CircleCheckIcon() {
  return (
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
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function PackagesPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        size="medium"
        eyebrow="OUR PACKAGES"
        title="Marketing Built for Hospitality"
        subtitle="From social media management to full-service digital marketing. Choose the package that fits your property and let us handle the rest."
        primaryCTA={{ label: "Book a Discovery Call", href: "/contact" }}
        secondaryCTA={{ label: "View Our Services", href: "/services" }}
      />

      {/* Find Your Fit */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="FIND YOUR FIT"
              title="Which Property Are You?"
              subtitle="Start by identifying your property type. We'll recommend the right package based on your size, goals, and marketing needs."
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <PackagesTable />
          </FadeIn>
        </Container>
      </section>

      {/* How We Work */}
      <section className="bg-midnight dark-texture py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="HOW WE WORK"
              title="Built Specifically for Hospitality"
              subtitle="We don't just post content; we create a strategy designed to drive direct bookings and reduce your dependency on OTAs."
              theme="dark"
            />
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Audit & Strategy",
                description:
                  "We review your current digital presence and build a custom strategy around your property's goals.",
              },
              {
                step: "02",
                title: "Content Creation",
                description:
                  "We create content calendars, write copy, produce scripts, and build filming guides tailored to your brand.",
              },
              {
                step: "03",
                title: "Execution",
                description:
                  "We manage your platforms, run your campaigns, and publish content on schedule, so you can focus on your guests.",
              },
              {
                step: "04",
                title: "Optimisation",
                description:
                  "Monthly reporting, performance reviews, and ongoing strategy adjustments to maximise your return.",
              },
            ].map((item) => (
              <FadeIn key={item.step} delay={Number(item.step) * 0.1}>
                <div className="text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold text-lg font-bold text-midnight">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-soft-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft-white/60">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* What We Track vs What Most Agencies Track */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="REAL DATA, REAL RESULTS"
              title="We Track What Actually Drives Revenue"
              subtitle="Most agencies use generic analytics metrics as their key conversions to inflate results. We report those too, but we also track the actions that actually lead to bookings."
            />
          </FadeIn>

          {/* Mobile: collapsible accordion version */}
          <MobileTrackingSection />

          {/* Desktop: full layout */}
          <div className="mx-auto hidden max-w-5xl md:block">
            {/* The Problem */}
            <FadeIn delay={0.1}>
              <div className="mb-8 rounded-lg border border-midnight/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-red-500">
                      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-bold text-midnight">The Problem With Most Agency Reporting</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-midnight/70">
                  Many agencies use default analytics metrics as their key performance indicators: scrolls, total clicks, page views, impressions, reach, and ad spend totals. These are useful as supplementary data, but when they&apos;re presented as your main conversions, they paint a misleading picture of how your marketing is actually performing.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    "Scroll depth",
                    "Total page clicks",
                    "Impressions & reach",
                    "Total ad spend",
                    "Page views",
                    "Follower count",
                    "Post engagement rate",
                    "Generic session data",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 flex-shrink-0 text-red-400">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-midnight/50">
                  These metrics are reported as &quot;conversions,&quot; making it look like your campaigns are performing, when in reality, nobody may have called, enquired, or booked.
                </p>
              </div>
            </FadeIn>

            {/* Two columns: What we also track + What that unlocks */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* What we track */}
              <FadeIn delay={0.15}>
                <div className="flex h-full flex-col rounded-lg border border-gold/30 bg-white p-6 shadow-sm ring-1 ring-gold/10 sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gold">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <h3 className="text-lg font-bold text-midnight">The Conversions We Track</h3>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-midnight/60">
                    We still report social metrics, reach, and engagement; they matter for growth. But our key conversions are tied to real business actions:
                  </p>
                  <ul className="flex-1 space-y-3">
                    {[
                      "Direct booking link clicks",
                      "Form submissions & enquiries",
                      "Click-to-call tracking",
                      "Click-to-email tracking",
                      "Click-to-WhatsApp / chatbot",
                      "GBP actions (calls, directions, website visits)",
                      "Click-through rate (CTR) by campaign",
                      "Return on ad spend (ROAS)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-midnight/70">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* What that unlocks */}
              <FadeIn delay={0.25}>
                <div className="flex h-full flex-col rounded-lg border border-gold/30 bg-white p-6 shadow-sm ring-1 ring-gold/10 sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-gold">
                        <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 7a1.5 1.5 0 0 0-1.5 1.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10 7ZM4.5 12A1.5 1.5 0 0 0 3 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 4.5 12Z" />
                      </svg>
                    </span>
                    <h3 className="text-lg font-bold text-midnight">The Insights This Unlocks</h3>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-midnight/60">
                    When you track real conversions, you can measure what actually matters to your bottom line:
                  </p>
                  <ul className="flex-1 space-y-3">
                    {[
                      { metric: "Cost Per Acquisition (CPA)", desc: "How much it costs to acquire each guest" },
                      { metric: "Cost Per Lead (CPL)", desc: "What you pay for each enquiry or call" },
                      { metric: "Customer Lifetime Value (LTV)", desc: "The long-term revenue value of each guest" },
                      { metric: "Revenue Per Channel", desc: "Which marketing channel drives the most bookings" },
                      { metric: "Cross-Channel Attribution", desc: "How channels work together to convert guests" },
                      { metric: "True ROAS", desc: "Real return on every rand spent on advertising" },
                    ].map((item) => (
                      <li key={item.metric} className="rounded bg-gold/5 px-3 py-2.5">
                        <span className="text-sm font-semibold text-midnight">{item.metric}</span>
                        <p className="mt-0.5 text-xs text-midnight/50">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3}>
              <p className="mt-8 text-center text-sm leading-relaxed text-midnight/60">
                We set up proper analytics infrastructure on day one (GA4, Google Tag Manager, and custom event tracking), so every click, call, and form submission is captured. Your social metrics and page growth are still reported, but they&apos;re never used to mask what really matters: are people booking?
              </p>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Photography Bundles */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="PHOTOGRAPHY BUNDLES"
              title="Professional Visuals for Your Property"
              subtitle="High-quality photography that showcases your property at its best. Currently available in South Africa only."
            />
          </FadeIn>

          {/* Mobile: collapsible accordion */}
          <MobilePhotographyBundles
            bundles={photographyBundles}
            addOns={photographyAddOns}
          />

          {/* Desktop: card grid */}
          <div className="hidden md:block">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {photographyBundles.map((pkg, index) => (
                <SlideUp key={pkg.name} delay={index * 0.1}>
                  <div className="flex h-full flex-col rounded-lg border border-midnight/10 bg-white p-6 shadow-sm">
                    <div className="mb-4 border-b border-midnight/10 pb-4">
                      <h3 className="text-lg font-bold text-midnight">{pkg.name}</h3>
                    </div>
                    <ul className="mb-6 flex-1 space-y-3">
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
                </SlideUp>
              ))}
            </div>

            {/* Photography Add-ons */}
            <FadeIn delay={0.3}>
              <div className="mt-12 rounded-lg border border-midnight/10 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-center text-lg font-bold text-midnight">
                  Photography Add-Ons
                </h3>
                <ul className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
                  {photographyAddOns.map((addOn) => (
                    <li
                      key={addOn}
                      className="flex items-center gap-3 text-sm text-midnight/70"
                    >
                      <CircleCheckIcon />
                      <span>{addOn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* One-Time & Strategy Services */}
      <section className="bg-midnight dark-texture py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="ONE-TIME & STRATEGY SERVICES"
              title="Targeted Solutions When You Need Them"
              subtitle="Don't need a monthly package? These standalone services are designed to solve specific challenges."
              theme="dark"
            />
          </FadeIn>

          {/* Mobile: collapsible accordion */}
          <MobileOneTimeServices services={oneTimeServices} />

          {/* Desktop: card grid */}
          <div className="hidden gap-4 md:grid md:grid-cols-3 lg:grid-cols-5">
            {oneTimeServices.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.06}>
                <div className="flex h-full flex-col items-center rounded-lg border border-gold/20 bg-deep-black p-5 text-center">
                  <h3 className="text-sm font-semibold text-gold">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-soft-white/50">
                    {service.description}
                  </p>
                  <Button href="/contact" variant="secondary" className="mt-4 text-xs">
                    Enquire
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="GOOD TO KNOW"
              title="Frequently Asked Questions"
            />
          </FadeIn>

          <FadeIn delay={0.1}>
            <FAQAccordion items={faqItems} />
          </FadeIn>
        </Container>
      </section>

      {/* CTA Banner */}
      <CTABanner
        variant="gold"
        title="Ready to Get Started?"
        subtitle="Book a free discovery call and let's find the right package for your property."
      />
    </>
  );
}
