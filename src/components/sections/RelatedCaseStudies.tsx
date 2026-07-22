import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";

interface RelatedCaseStudiesProps {
  slugs: string[];
  heading?: string;
}

// Renders a curated set of related case study links to strengthen internal
// linking between case studies and from service pages into proof.
export function RelatedCaseStudies({
  slugs,
  heading = "Related Case Studies",
}: RelatedCaseStudiesProps) {
  const items = slugs
    .map((slug) => caseStudies.find((cs) => cs.slug === slug))
    .filter((cs): cs is (typeof caseStudies)[number] => Boolean(cs));

  if (items.length === 0) return null;

  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        <FadeIn>
          <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
            {heading}
          </h2>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((caseStudy, index) => (
            <FadeIn key={caseStudy.slug} delay={index * 0.1}>
              <Link
                href={`/case-studies/${caseStudy.slug}`}
                className="group block h-full rounded-lg bg-deep-black p-8 transition-transform duration-300 hover:-translate-y-1"
              >
                <Badge variant="gold">{caseStudy.propertyType}</Badge>
                <h3 className="mt-4 text-xl font-bold text-soft-white transition-colors duration-300 group-hover:text-gold sm:text-2xl">
                  {caseStudy.title}
                </h3>
                <p className="mt-2 text-sm text-gold">{caseStudy.location}</p>
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
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
