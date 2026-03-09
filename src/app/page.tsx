import { Hero } from "@/components/sections/Hero";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { FeaturedCaseStudy } from "@/components/sections/FeaturedCaseStudy";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

export default function HomePage() {
  return (
    <>
      {/* --- Hero --- */}
      <Hero
        eyebrow="DIGITAL MARKETING FOR HOSPITALITY"
        title="More Guests. Fewer Commissions."
        subtitle="We help independent hospitality businesses drive direct bookings, strengthen their brand, and reduce dependency on OTAs — so more revenue stays where it belongs."
        primaryCTA={{ label: "Book a Discovery Call", href: "/contact" }}
        secondaryCTA={{ label: "See Our Work", href: "/case-studies" }}
      />

      {/* --- Knife Twist — Pain Points --- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              SOUND FAMILIAR?
            </p>
            <h2 className="mx-auto max-w-3xl text-center text-3xl font-bold text-midnight sm:text-4xl">
              Your Revenue Is Leaking — and You Already Know It
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-warm-gray">
              If any of these feel familiar, you&apos;re not alone. Most hospitality businesses face the same challenges — and keep paying the price.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "💸",
                title: "OTAs Are Eating Your Margins",
                description:
                  "Booking.com and Expedia take 15–25% of every reservation. That's revenue you earned — paid to a middleman.",
              },
              {
                icon: "📉",
                title: "Inconsistent Online Presence",
                description:
                  "Outdated photos, inactive social media, unanswered Google reviews. Guests scroll past — straight to your competitors.",
              },
              {
                icon: "🎯",
                title: "Ad Spend with No Clear Return",
                description:
                  "You've boosted posts or tried Google Ads, but with no strategy behind it the budget disappears and bookings don't follow.",
              },
              {
                icon: "🔁",
                title: "Dependency on Third Parties",
                description:
                  "When OTAs change their algorithm or policies, your occupancy takes the hit. You don't own the guest relationship.",
              },
              {
                icon: "🕐",
                title: "No Time to Market Properly",
                description:
                  "You're running a property — not a marketing agency. Content creation, campaigns, and strategy keep falling to the bottom of the list.",
              },
              {
                icon: "📊",
                title: "No Data, No Direction",
                description:
                  "Without proper tracking and reporting, you're making decisions in the dark. You can't improve what you can't measure.",
              },
            ].map((pain, index) => (
              <FadeIn key={pain.title} delay={index * 0.08}>
                <div className="rounded-lg border border-midnight/10 bg-white p-6 shadow-sm">
                  <span className="text-2xl">{pain.icon}</span>
                  <h3 className="mt-3 text-lg font-semibold text-midnight">
                    {pain.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                    {pain.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 text-center">
              <p className="text-lg font-semibold text-midnight">
                We built Revolution Media to solve exactly this.
              </p>
              <div className="mt-6">
                <Button href="/contact" variant="primary">
                  Let&apos;s Fix This Together
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Positioning Statement --- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container className="text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              WHO WE ARE
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Where Strategy Meets Hospitality
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-warm-gray">
              Revolution Media is a specialist digital marketing agency built
              exclusively for travel and hospitality businesses. From boutique
              hotels to luxury resorts, we combine deep industry knowledge with
              performance-driven strategy to turn visibility into direct
              bookings — no guesswork, no generic playbooks.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/about" variant="primary">
                Learn About Us
              </Button>
              <Button href="/services" variant="secondary">
                View Our Services
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Services --- */}
      <ServiceGrid limit={6} />

      {/* --- Revolution Motion CTA --- */}
      <CTABanner
        variant="gold"
        title="Professional Video for Your Property"
        subtitle="Revolution Motion creates cinematic content that inspires guests to book direct."
        ctaLabel="Explore Revolution Motion"
        ctaHref="/revolution-motion"
      />

      {/* --- Featured Case Study --- */}
      <FeaturedCaseStudy />

      {/* --- Testimonials --- */}
      <Testimonials />

      {/* --- Referral Program CTA --- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container className="text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold-deep">
              REFERRAL AMBASSADOR PROGRAM
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Know a Property That Needs Better Marketing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-warm-gray">
              Earn a 15% commission for every hospitality business you refer to
              Revolution Media. It&apos;s simple — refer, we close, you get paid.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/referral-program" variant="primary">
                Refer &amp; Earn 15%
              </Button>
              <Button href="/ambassador" variant="ghost">
                Ambassador Login
              </Button>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* --- Final CTA Banner --- */}
      <CTABanner
        variant="gold"
        title="Ready to Reduce Your OTA Dependency?"
        subtitle="Let's build a direct-booking engine tailored to your property."
      />
    </>
  );
}
