import { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results for hospitality brands. Explore how Revolution Media drives measurable growth for hotels, lodges, and tourism properties across South Africa.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <Hero
        size="medium"
        eyebrow="CASE STUDIES"
        title="Results That Speak"
        subtitle="Real stories from real hospitality properties. Every metric is earned, every result is measurable."
        primaryCTA={{ label: "Start Your Story", href: "/contact" }}
      />

      {/* Case Study Grid */}
      <section className="bg-soft-white py-20 sm:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {caseStudies.map((caseStudy, index) => (
              <FadeIn key={caseStudy.slug} delay={index * 0.1}>
                <Link
                  href={`/case-studies/${caseStudy.slug}`}
                  className="group block rounded-lg bg-deep-black p-8 transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* Property Type Badge */}
                  <Badge variant="gold">{caseStudy.propertyType}</Badge>

                  {/* Title */}
                  <h3 className="mt-4 text-xl font-bold text-soft-white transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                    {caseStudy.title}
                  </h3>

                  {/* Location */}
                  <p className="mt-2 text-sm text-gold">{caseStudy.location}</p>

                  {/* Metrics Row */}
                  <div className="mt-6 flex flex-wrap gap-6">
                    {caseStudy.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.label}>
                        <p className="text-2xl font-bold text-gold">
                          {metric.value}
                        </p>
                        <p className="text-xs text-soft-white/60">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {caseStudy.tags.map((tag) => (
                      <Badge key={tag} variant="dark">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        variant="gold"
        title="Your Property Could Be Next"
        ctaLabel="Book a Discovery Call"
        ctaHref="/contact"
      />
    </>
  );
}
