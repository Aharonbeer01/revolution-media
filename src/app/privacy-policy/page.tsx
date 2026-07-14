import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Revolution Media Agency. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold text-midnight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-midnight/50">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-midnight/80 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-midnight">1. Introduction</h2>
            <p className="mt-2">
              Revolution Media Agency (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
              protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website revolutionmedia.agency and use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">2. Information We Collect</h2>
            <p className="mt-2">We may collect the following types of information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and property
                name when you submit our contact form or register as an ambassador.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our website,
                including pages visited, time spent, browser type, and referring URLs.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies and similar technologies to
                improve your browsing experience and analyse website traffic.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">3. How We Use Your Information</h2>
            <p className="mt-2">We use the information we collect to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Respond to your enquiries and provide our services</li>
              <li>Send you relevant communications about our services</li>
              <li>Improve our website and user experience</li>
              <li>Analyse website traffic and usage patterns</li>
              <li>Process ambassador referrals and commissions</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">4. Information Sharing</h2>
            <p className="mt-2">
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information with trusted service providers who assist us in operating our website
              and conducting our business, provided they agree to keep your information confidential.
              These may include:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Email service providers (for sending communications)</li>
              <li>Analytics providers (for website usage data)</li>
              <li>Hosting and infrastructure providers</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">5. Data Security</h2>
            <p className="mt-2">
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">6. Your Rights</h2>
            <p className="mt-2">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at info@revolutionmedia.agency.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">7. Cookies</h2>
            <p className="mt-2">
              Our website uses cookies to enhance your experience. You can control cookie settings
              through your browser preferences. Disabling cookies may affect the functionality of
              certain parts of our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">8. Third-Party Links</h2>
            <p className="mt-2">
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices or content of those websites. We encourage you to review the privacy
              policies of any third-party sites you visit.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">10. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@revolutionmedia.agency"
                className="text-gold underline underline-offset-2 hover:text-gold-deep"
              >
                info@revolutionmedia.agency
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
