import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { RelatedServices } from "@/components/sections/RelatedServices";
import { RelatedCaseStudies } from "@/components/sections/RelatedCaseStudies";
import { caseStudies } from "@/lib/case-studies";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);

  if (!caseStudy) {
    return { title: "Case Study Not Found" };
  }

  return {
    title: caseStudy.title,
    description: `${caseStudy.propertyType} in ${caseStudy.location}. See how Revolution Media delivered measurable results for ${caseStudy.title.split(":")[0]}.`,
    alternates: {
      canonical: `/case-studies/${slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Case Studies",
        item: `${SITE_URL}/case-studies`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caseStudy.title,
        item: `${SITE_URL}/case-studies/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <Hero
        size="medium"
        eyebrow={caseStudy.propertyType}
        title={caseStudy.title}
        subtitle={caseStudy.location}
        primaryCTA={{ label: "Get Results Like These", href: "/contact" }}
      />

      {/* Metrics Bar */}
      <section className="bg-gold py-12 sm:py-16">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {caseStudy.metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-3xl font-bold text-midnight sm:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-midnight/60">{metric.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The Problem */}
      <section className="bg-soft-white py-20 sm:py-28">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                The Problem
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-midnight/70">
                {caseStudy.problem}
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* The Strategy */}
      <section className="bg-soft-white py-20 sm:py-28">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                The Strategy
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-midnight/70">
                {caseStudy.strategy}
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* The Execution */}
      <section className="bg-cream py-20 sm:py-28">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-midnight sm:text-4xl">
                The Execution
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-midnight/70">
                {caseStudy.execution}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {caseStudy.tags.map((tag) => (
                  <Badge key={tag} variant="gold">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* The Results */}
      <section className="bg-midnight py-20 sm:py-28">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-soft-white sm:text-4xl">
                The Results
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-soft-white/70">
                {caseStudy.results}
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Services used on this project */}
      {caseStudy.relatedServices && caseStudy.relatedServices.length > 0 && (
        <RelatedServices
          slugs={caseStudy.relatedServices}
          heading="Services We Used"
          variant="dark"
        />
      )}

      {/* More case studies */}
      {caseStudy.relatedCaseStudies && caseStudy.relatedCaseStudies.length > 0 && (
        <RelatedCaseStudies
          slugs={caseStudy.relatedCaseStudies}
          heading="More Case Studies"
        />
      )}

      <CTABanner
        variant="gold"
        title="Ready to Write Your Success Story?"
        ctaLabel="Book a Discovery Call"
        ctaHref="/contact"
      />
    </>
  );
}
