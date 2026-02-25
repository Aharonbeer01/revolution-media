import { testimonials } from "@/lib/testimonials";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { FadeIn } from "@/components/motion/FadeIn";

export function Testimonials() {
  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by Hospitality Leaders"
            subtitle="Hear from property owners and managers who partnered with us to grow their direct bookings."
          />
        </FadeIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, i) => (
            <FadeIn key={testimonial.author} delay={i * 0.1}>
              <TestimonialCard {...testimonial} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
