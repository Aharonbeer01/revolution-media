import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Revolution Media Agency. Read our terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold text-midnight">Terms of Service</h1>
        <p className="mt-2 text-sm text-midnight/50">
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-midnight/80 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-midnight">1. Agreement to Terms</h2>
            <p className="mt-2">
              By accessing or using the Revolution Media Agency website (revolutionmedia.agency) and
              our services, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our website or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">2. Services</h2>
            <p className="mt-2">
              Revolution Media Agency provides digital marketing services for the travel and
              hospitality industry. Specific services, deliverables, timelines, and fees will be
              outlined in individual service agreements or proposals provided to clients.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">3. Use of Website</h2>
            <p className="mt-2">You agree to use our website only for lawful purposes and in a way that does not:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Infringe the rights of any third party</li>
              <li>Restrict or inhibit anyone else&apos;s use of the website</li>
              <li>Attempt to gain unauthorised access to our systems</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Use automated systems to scrape or extract data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">4. Intellectual Property</h2>
            <p className="mt-2">
              All content on this website — including text, graphics, logos, images, and software — is
              the property of Revolution Media Agency or its content suppliers and is protected by
              intellectual property laws. You may not reproduce, distribute, or create derivative
              works from any content without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">5. Client Work and Deliverables</h2>
            <p className="mt-2">
              Ownership and usage rights for work produced by Revolution Media Agency for clients will
              be defined in individual service agreements. Unless otherwise agreed in writing, clients
              receive a licence to use deliverables for their intended purpose upon full payment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">6. Ambassador Referral Program</h2>
            <p className="mt-2">
              Participation in the Revolution Media Ambassador Referral Program is subject to
              additional terms outlined during registration. We reserve the right to modify commission
              rates, programme terms, or terminate the programme at any time with reasonable notice to
              active ambassadors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">7. Limitation of Liability</h2>
            <p className="mt-2">
              Revolution Media Agency provides this website and its content on an &quot;as is&quot; basis.
              We make no warranties, expressed or implied, regarding the accuracy, completeness, or
              reliability of any content. To the fullest extent permitted by law, we shall not be
              liable for any indirect, incidental, or consequential damages arising from your use of
              our website or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">8. Payment Terms</h2>
            <p className="mt-2">
              Payment terms for our services will be specified in individual service agreements. Unless
              otherwise agreed, invoices are due within 7 days of issue. We reserve the right to
              suspend services for overdue payments.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">9. Termination</h2>
            <p className="mt-2">
              We reserve the right to terminate or suspend your access to our website at our sole
              discretion, without notice, for conduct that we believe violates these Terms of Service
              or is harmful to other users, us, or third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">10. Governing Law</h2>
            <p className="mt-2">
              These Terms of Service shall be governed by and construed in accordance with the laws of
              South Africa. Any disputes arising from these terms shall be subject to the exclusive
              jurisdiction of the courts of South Africa.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">11. Changes to Terms</h2>
            <p className="mt-2">
              We may revise these Terms of Service at any time by updating this page. Your continued
              use of the website after any changes constitutes your acceptance of the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-midnight">12. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about these Terms of Service, please contact us at:
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
