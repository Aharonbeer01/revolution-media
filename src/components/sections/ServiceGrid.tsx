import Link from "next/link";
import { services } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

interface ServiceGridProps {
  limit?: number;
  showHeading?: boolean;
}

function ServiceCardInner({ service }: { service: (typeof services)[0] }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block rounded-lg bg-warm-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <ServiceIcon slug={service.icon} className="h-8 w-8 text-gold" />
      <h3 className="mt-4 text-lg font-semibold text-midnight group-hover:text-gold transition-colors">
        {service.title}
      </h3>
      <p className="mt-2 text-sm text-midnight/60 leading-relaxed">
        {service.shortDescription}
      </p>
      <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold">
        Learn more
        <svg
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

export function ServiceGrid({ limit, showHeading = true }: ServiceGridProps) {
  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        {showHeading && (
          <FadeIn>
            <SectionHeading
              eyebrow="Our Services"
              title="How We Drive Direct Revenue"
              subtitle="Every service is built around one goal: turning online visibility into direct bookings for your property."
            />
          </FadeIn>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => (
            <ServiceCardInner key={service.slug} service={service} />
          ))}
        </div>

        {limit && limit < services.length && (
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-semibold text-gold hover:underline underline-offset-4"
            >
              View All Services
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
