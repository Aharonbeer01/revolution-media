import { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free 30-minute discovery call with Revolution Media to discuss your property's marketing goals and how we can help drive more direct bookings.",
};

const discoverySteps = [
  {
    number: "1",
    title: "We learn about your property",
    description:
      "Tell us about your hotel, guesthouse, or resort — your location, target market, and what makes your property unique.",
  },
  {
    number: "2",
    title: "We review your current marketing",
    description:
      "We take a quick look at your website, social media presence, and any paid advertising to understand where you stand today.",
  },
  {
    number: "3",
    title: "We identify quick wins",
    description:
      "Based on what we see, we highlight the immediate opportunities that could improve your direct bookings and reduce OTA dependency.",
  },
  {
    number: "4",
    title: "We outline next steps",
    description:
      "You leave the call with a clear understanding of what to prioritise — whether you work with us or not.",
  },
];

const faqs = [
  {
    question: "Do you work with properties outside South Africa?",
    answer:
      "Yes. All of our digital marketing services — paid advertising, social media management, SEO, and web design — are delivered remotely. We work with hospitality properties across Africa and internationally.",
  },
  {
    question: "What's the minimum contract period?",
    answer:
      "We recommend a minimum of 3 months for any ongoing service. This gives enough time to implement strategies, gather data, and start seeing meaningful results. Project-based work such as website design has its own timeline.",
  },
  {
    question: "How quickly will I see results?",
    answer:
      "Paid advertising campaigns can generate results within the first few weeks of launch. SEO and organic social media strategies typically take 3 to 6 months to build significant momentum. We set clear expectations upfront so there are no surprises.",
  },
  {
    question: "What information should I have ready for the call?",
    answer:
      "It helps to know your average occupancy rate, your current marketing budget (if any), and your main goals. But don't worry if you don't have everything — we'll guide the conversation.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Hero
        size="small"
        eyebrow="GET IN TOUCH"
        title="Let's Talk About Your Property"
        subtitle="Book a free 30-minute discovery call to discuss your property's goals and how we can help."
        primaryCTA={{ label: "Book Below", href: "#booking" }}
      />

      {/* Discovery Call Info + Contact Form */}
      <section id="booking" className="bg-soft-white py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column — Discovery Call Steps */}
            <FadeIn>
              <h2 className="text-3xl font-bold text-midnight">
                What Happens on a Discovery Call?
              </h2>
              <p className="mt-4 text-midnight/60">
                Our discovery call is a no-pressure conversation designed to understand your property and identify opportunities.
              </p>

              <div className="mt-8 space-y-6">
                {discoverySteps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-lg font-bold text-midnight">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-midnight">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-midnight/60">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Right Column — Contact Form */}
            <FadeIn delay={0.15}>
              <ContactForm />
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <h2 className="text-center text-3xl font-bold text-midnight">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={index * 0.08}>
                <div>
                  <h3 className="text-lg font-semibold text-midnight">
                    {faq.question}
                  </h3>
                  <p className="mt-2 leading-relaxed text-midnight/70">
                    {faq.answer}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        variant="dark"
        title="Prefer Email? Reach Out Directly"
        subtitle="Send us a message at aharon@revolutionmedia.agency and we'll get back to you within 24 hours."
        ctaLabel="Send an Email"
        ctaHref="mailto:aharon@revolutionmedia.agency"
      />
    </>
  );
}
