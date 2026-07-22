import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Metric } from "@/components/ui/Metric";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";

export function FeaturedCaseStudy() {
  const featured = caseStudies[0];
  if (!featured) return null;

  const others = caseStudies.slice(1);

  return (
    <section className="bg-midnight dark-texture py-16 sm:py-20">
      <Container>
        <FadeIn>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-gold text-center">
            Featured Case Study
          </p>
          <h2 className="text-3xl font-bold text-soft-white text-center sm:text-4xl">
            Results That Speak
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left: Image placeholder */}
          <FadeIn direction="left">
            <div className="aspect-[4/3] rounded-lg bg-deep-black flex items-center justify-center">
              <span className="text-soft-white/20 text-lg">Property Image</span>
            </div>
          </FadeIn>

          {/* Right: Content */}
          <FadeIn direction="right" delay={0.15}>
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.tags.map((tag) => (
                <Badge key={tag} variant="gold">{tag}</Badge>
              ))}
            </div>

            <h3 className="text-xl font-bold text-soft-white">
              {featured.title}
            </h3>
            <p className="mt-1 text-sm text-gold">
              {featured.propertyType} &mdash; {featured.location}
            </p>

            <p className="mt-4 text-soft-white/70 leading-relaxed">
              {featured.problem}
            </p>

            {/* Metrics */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              {featured.metrics.slice(0, 4).map((metric) => (
                <Metric
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  prefix={metric.prefix}
                />
              ))}
            </div>

            <div className="mt-8">
              <Button href={`/case-studies/${featured.slug}`} variant="primary" data-track="featured_case_study">
                Read the Full Story
              </Button>
            </div>
          </FadeIn>
        </div>

        {/* More success stories: keeps every case study linked from the homepage */}
        {others.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {others.map((cs, index) => (
              <FadeIn key={cs.slug} delay={index * 0.1}>
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group block h-full rounded-lg bg-deep-black p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <Badge variant="gold">{cs.propertyType}</Badge>
                  <h3 className="mt-4 text-lg font-bold text-soft-white transition-colors duration-300 group-hover:text-gold">
                    {cs.title}
                  </h3>
                  <p className="mt-2 text-sm text-gold">{cs.location}</p>
                  <div className="mt-4 flex flex-wrap gap-6">
                    {cs.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.label}>
                        <p className="text-xl font-bold text-gold">
                          {metric.value}
                        </p>
                        <p className="text-xs text-soft-white/60">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
