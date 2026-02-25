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

      {/* --- Positioning Statement --- */}
      <section className="bg-soft-white py-16 sm:py-20">
        <Container className="text-center">
          <FadeIn>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold">
              WHO WE ARE
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Where Strategy Meets Hospitality
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-midnight/60">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold">
              REFERRAL AMBASSADOR PROGRAM
            </p>
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-midnight sm:text-4xl">
              Know a Property That Needs Better Marketing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-midnight/60">
              Earn a 15% commission for every hospitality business you refer to
              Revolution Media. Join our Ambassador Program today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/referral-program" variant="primary">
                Become an Ambassador
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
