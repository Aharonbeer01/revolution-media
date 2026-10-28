import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { AmbassadorSignupForm } from "@/components/sections/AmbassadorSignupForm";

/**
 * The referral programme. Since October 2026 it runs on the agency's client
 * portal, by invitation. The form here registers interest only: it emails
 * the team, who send a portal invitation when it is a good fit. An existing
 * ambassador signs in on the portal. Referrals come from any industry.
 */
const JOIN_EMAIL = "aharon@revolutionmedia.agency";
const JOIN_HREF = `mailto:${JOIN_EMAIL}?subject=${encodeURIComponent("Referral Ambassador Program")}`;
const PORTAL_SIGN_IN = "https://portal.revolutionmedia.agency/login";

export const metadata: Metadata = {
  title: "Referral Ambassador Program | Revolution Media",
  description:
    "Earn 15% commission by referring businesses to Revolution Media. Our Referral Ambassador Program is open to anyone with connections, by invitation.",
  alternates: {
    canonical: "/referral-program",
  },
};

/* ------------------------------------------------
   DATA
   ------------------------------------------------ */

const steps = [
  {
    number: "1",
    title: "Refer",
    description:
      "Connect us with a business in your network. Submit their details from your ambassador portal, send them your personal booking link, or introduce us directly.",
  },
  {
    number: "2",
    title: "We Close",
    description:
      "Our team takes it from here. We\u2019ll reach out, present our services, and onboard the new client with a tailored strategy.",
  },
  {
    number: "3",
    title: "Get Paid",
    description:
      "Once the client signs on and pays their first invoice, you receive a 15% one-time commission. Simple as that.",
  },
];

const audiences = [
  {
    title: "Industry Professionals",
    description:
      "Managers, operators and consultants with connections across the businesses they work with.",
  },
  {
    title: "Current Clients",
    description:
      "Already working with us? Refer another business and receive your commission as a credit on your next invoice.",
  },
  {
    title: "Business Networks",
    description:
      "Accountants, business coaches, and advisors who work with growing businesses.",
  },
  {
    title: "Anyone with Connections",
    description:
      "If you know a business that needs better marketing, you can be an ambassador.",
  },
];

const benefits = [
  "15% commission on the referred client\u2019s first invoice",
  "Personal referral code, booking link and tracking dashboard",
  "Dedicated ambassador support",
  "No limit on referrals",
  "Current clients receive invoice credit instead of cash",
];

/* ------------------------------------------------
   PAGE
   ------------------------------------------------ */

export default function ReferralProgramPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      <Hero
        size="medium"
        eyebrow="REFERRAL AMBASSADOR PROGRAM"
        title="Earn While You Connect"
        subtitle="Know a business that needs better marketing? Refer them to Revolution Media and earn a 15% commission when they sign on."
        primaryCTA={{ label: "Become an Ambassador", href: "#join" }}
        secondaryCTA={{ label: "Learn More", href: "#how-it-works" }}
      />

      {/* ---- How It Works ---- */}
      <section id="how-it-works" className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="Three Simple Steps"
            />
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <FadeIn key={step.number} delay={Number(step.number) * 0.12}>
                <div className="rounded-lg bg-warm-white p-8 text-center shadow-sm">
                  <span className="text-5xl font-bold text-gold">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-midnight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-midnight/60">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- Who Can Join ---- */}
      <section className="bg-midnight dark-texture py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="WHO IS IT FOR"
              title="Open to Everyone"
              theme="dark"
            />
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2">
            {audiences.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="rounded-lg border border-soft-white/10 p-6">
                  <h3 className="text-lg font-semibold text-gold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-soft-white/70">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* ---- What You Get ---- */}
      <section className="bg-cream py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="AMBASSADOR BENEFITS"
              title="What You Get"
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mx-auto max-w-2xl">
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-midnight">
                      &#10003;
                    </span>
                    <span className="text-midnight/80">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-center">
                <a
                  href="#join"
                  className="inline-flex items-center justify-center rounded bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-midnight transition-all duration-200 hover:bg-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Join the Program
                </a>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ---- How to Join ---- */}
      <section id="join" className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="JOIN THE PROGRAM"
              title="Refer, We Close, You Earn"
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mx-auto max-w-xl">
              <p className="mb-8 text-center leading-relaxed text-midnight/80">
                The program is by invitation. Tell us who you are and the kind
                of businesses you know. We review every request, and when it is
                a good fit we email you an invitation to set up your login on
                the ambassador portal.
              </p>
              <AmbassadorSignupForm />
              <p className="mt-6 text-center text-sm text-midnight/60">
                Already an ambassador?{" "}
                <a
                  href={PORTAL_SIGN_IN}
                  className="font-semibold text-gold-deep underline underline-offset-4"
                  data-track="referral_portal_sign_in"
                >
                  Sign in to your portal
                </a>
              </p>
              <p className="mt-2 text-center text-sm text-midnight/60">
                Prefer to email?{" "}
                <a
                  href={JOIN_HREF}
                  className="font-semibold text-gold-deep underline underline-offset-4"
                  data-track="referral_join_email"
                >
                  {JOIN_EMAIL}
                </a>
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ---- CTA Banner ---- */}
      <CTABanner
        variant="gold"
        title="Start Earning Today"
        subtitle="Join our network of referral ambassadors and earn commission on every successful referral."
        ctaLabel="Register Your Interest"
        ctaHref="#join"
      />
    </>
  );
}
