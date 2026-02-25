"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

/* ------------------------------------------------------------------
   Types
   ------------------------------------------------------------------ */

type View = "login" | "dashboard" | "referral-form";

type SubmitStatus = "idle" | "sending" | "success" | "error";

interface AmbassadorUser {
  name: string;
  email: string;
  referralCode: string;
}

interface ReferralFormData {
  // Ambassador details (pre-filled)
  ambassadorName: string;
  ambassadorEmail: string;
  referralCode: string;
  referralDate: string;
  // Client details
  contactName: string;
  businessName: string;
  businessType: string;
  location: string;
  clientEmail: string;
  phone: string;
  website: string;
  // Context
  relationship: string;
  discussedRevolution: string;
  servicesNeeded: string[];
  additionalContext: string;
}

/* ------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------ */

const BUSINESS_TYPES = [
  "Hotel",
  "Boutique Hotel",
  "Resort",
  "Safari Lodge",
  "Guest House",
  "Wine Estate",
  "Other",
];

const SERVICES = [
  "Marketing Strategy",
  "Google Ads",
  "Meta Ads",
  "TikTok Ads",
  "Social Media Management",
  "Content Creation",
  "Photography",
  "Copywriting",
  "SEO",
  "Email Marketing",
  "Revolution Motion",
];

const STATS = [
  { label: "Referrals Submitted", value: "3" },
  { label: "Pending", value: "1" },
  { label: "Successful", value: "2" },
  { label: "Commission Info", value: "Contact us for details" },
];

const INPUT_STYLES =
  "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

const LABEL_STYLES = "mb-1 block text-sm font-medium text-midnight";

/* ------------------------------------------------------------------
   Helper: today as YYYY-MM-DD
   ------------------------------------------------------------------ */

function todayISO(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

/* ------------------------------------------------------------------
   Sub-component: Login View
   ------------------------------------------------------------------ */

function LoginView({
  onLogin,
}: {
  onLogin: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-soft-white py-16">
      <Container>
        <FadeIn>
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-lg bg-warm-white p-8 shadow-sm sm:p-10">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-midnight">
                  Ambassador Portal
                </h1>
                <p className="mt-2 text-sm text-midnight/60">
                  Log in to submit referrals and track your commissions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="login-email" className={LABEL_STYLES}>
                    Email <span className="text-gold">*</span>
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={INPUT_STYLES}
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className={LABEL_STYLES}>
                    Password <span className="text-gold">*</span>
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={INPUT_STYLES}
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Log In
                </Button>
              </form>

              {/* Apply link */}
              <p className="mt-6 text-center text-sm text-midnight/50">
                Not an ambassador yet?{" "}
                <Link
                  href="/referral-program"
                  className="font-medium text-gold underline underline-offset-2 hover:text-gold-deep"
                >
                  Apply here
                </Link>
              </p>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------
   Sub-component: Dashboard View
   ------------------------------------------------------------------ */

function DashboardView({
  user,
  onShowReferralForm,
  onLogout,
}: {
  user: AmbassadorUser;
  onShowReferralForm: () => void;
  onLogout: () => void;
}) {
  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        {/* Header row */}
        <FadeIn>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-midnight">
                Welcome back, Ambassador
              </h1>
              <p className="mt-1 text-sm text-midnight/60">
                Logged in as {user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="text-sm font-medium text-midnight/50 underline underline-offset-2 transition-colors hover:text-midnight"
            >
              Log out
            </button>
          </div>
        </FadeIn>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.08}>
              <div className="rounded-lg bg-warm-white p-6 shadow-sm">
                <p className="text-sm font-medium text-midnight/50">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-midnight">
                  {stat.value}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.35}>
          <div className="mt-10 rounded-lg border border-gold/20 bg-cream p-6 text-center sm:p-8">
            <h2 className="text-xl font-bold text-midnight">
              Have a new referral?
            </h2>
            <p className="mt-2 text-sm text-midnight/60">
              Submit their details and our team will reach out within 48 hours.
            </p>
            <div className="mt-5">
              <Button onClick={onShowReferralForm} variant="primary">
                Submit New Referral
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------
   Sub-component: Referral Form View
   ------------------------------------------------------------------ */

function ReferralFormView({
  user,
  onBack,
}: {
  user: AmbassadorUser;
  onBack: () => void;
}) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const [formData, setFormData] = useState<ReferralFormData>({
    ambassadorName: user.name,
    ambassadorEmail: user.email,
    referralCode: user.referralCode,
    referralDate: todayISO(),
    contactName: "",
    businessName: "",
    businessType: "",
    location: "",
    clientEmail: "",
    phone: "",
    website: "",
    relationship: "",
    discussedRevolution: "",
    servicesNeeded: [],
    additionalContext: "",
  });

  function updateField(field: keyof ReferralFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function toggleService(service: string) {
    setFormData((prev) => {
      const current = prev.servicesNeeded;
      const updated = current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service];
      return { ...prev, servicesNeeded: updated };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitStatus("sending");

    try {
      const response = await fetch("/api/ambassador-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  }

  /* Success state */
  if (submitStatus === "success") {
    return (
      <section className="bg-soft-white py-16 sm:py-20">
        <Container>
          <FadeIn>
            <div className="mx-auto max-w-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-midnight">
                Referral Submitted Successfully
              </h2>
              <p className="mt-3 text-midnight/60">
                We will review and reach out to the client within 48 hours. You
                will receive updates at your registered email.
              </p>
              <div className="mt-8">
                <Button onClick={onBack} variant="primary">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-soft-white py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <FadeIn>
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-1.5 text-sm font-medium text-midnight/50 transition-colors hover:text-midnight"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              Back to Dashboard
            </button>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-10">
              <h2 className="text-2xl font-bold text-midnight">
                Submit New Referral
              </h2>
              <p className="mt-2 text-sm text-midnight/60">
                Fill in the details below and we will take it from here.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                {/* ---- Section: Ambassador Details ---- */}
                <fieldset>
                  <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
                    Your Details (Ambassador)
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ref-ambassador-name"
                        className={LABEL_STYLES}
                      >
                        Your Name
                      </label>
                      <input
                        id="ref-ambassador-name"
                        type="text"
                        readOnly
                        value={formData.ambassadorName}
                        className={`${INPUT_STYLES} bg-soft-white cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-ambassador-email"
                        className={LABEL_STYLES}
                      >
                        Your Email
                      </label>
                      <input
                        id="ref-ambassador-email"
                        type="email"
                        readOnly
                        value={formData.ambassadorEmail}
                        className={`${INPUT_STYLES} bg-soft-white cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-referral-code"
                        className={LABEL_STYLES}
                      >
                        Referral Code
                      </label>
                      <input
                        id="ref-referral-code"
                        type="text"
                        readOnly
                        value={formData.referralCode}
                        className={`${INPUT_STYLES} bg-soft-white cursor-not-allowed`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-referral-date"
                        className={LABEL_STYLES}
                      >
                        Date of Referral
                      </label>
                      <input
                        id="ref-referral-date"
                        type="date"
                        readOnly
                        value={formData.referralDate}
                        className={`${INPUT_STYLES} bg-soft-white cursor-not-allowed`}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* ---- Section: Client Details ---- */}
                <fieldset>
                  <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
                    Client Details
                  </legend>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ref-contact-name"
                        className={LABEL_STYLES}
                      >
                        Contact Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="ref-contact-name"
                        type="text"
                        required
                        placeholder="Full name"
                        value={formData.contactName}
                        onChange={(e) =>
                          updateField("contactName", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-business-name"
                        className={LABEL_STYLES}
                      >
                        Business Name <span className="text-gold">*</span>
                      </label>
                      <input
                        id="ref-business-name"
                        type="text"
                        required
                        placeholder="Hotel or business name"
                        value={formData.businessName}
                        onChange={(e) =>
                          updateField("businessName", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-business-type"
                        className={LABEL_STYLES}
                      >
                        Business Type <span className="text-gold">*</span>
                      </label>
                      <select
                        id="ref-business-type"
                        required
                        value={formData.businessType}
                        onChange={(e) =>
                          updateField("businessType", e.target.value)
                        }
                        className={INPUT_STYLES}
                      >
                        <option value="" disabled>
                          Select type
                        </option>
                        {BUSINESS_TYPES.map((bt) => (
                          <option key={bt} value={bt}>
                            {bt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ref-location" className={LABEL_STYLES}>
                        Location <span className="text-gold">*</span>
                      </label>
                      <input
                        id="ref-location"
                        type="text"
                        required
                        placeholder="City, region, or country"
                        value={formData.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ref-client-email"
                        className={LABEL_STYLES}
                      >
                        Email <span className="text-gold">*</span>
                      </label>
                      <input
                        id="ref-client-email"
                        type="email"
                        required
                        placeholder="client@example.com"
                        value={formData.clientEmail}
                        onChange={(e) =>
                          updateField("clientEmail", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>
                    <div>
                      <label htmlFor="ref-phone" className={LABEL_STYLES}>
                        Phone
                      </label>
                      <input
                        id="ref-phone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className={INPUT_STYLES}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="ref-website" className={LABEL_STYLES}>
                        Website
                      </label>
                      <input
                        id="ref-website"
                        type="url"
                        placeholder="https://www.example.com"
                        value={formData.website}
                        onChange={(e) => updateField("website", e.target.value)}
                        className={INPUT_STYLES}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* ---- Section: Context ---- */}
                <fieldset>
                  <legend className="mb-4 text-sm font-semibold uppercase tracking-[0.1em] text-gold">
                    Context
                  </legend>
                  <div className="space-y-5">
                    {/* Relationship */}
                    <div>
                      <label
                        htmlFor="ref-relationship"
                        className={LABEL_STYLES}
                      >
                        How do you know this client?{" "}
                        <span className="text-gold">*</span>
                      </label>
                      <textarea
                        id="ref-relationship"
                        required
                        rows={3}
                        placeholder="Describe your connection or relationship..."
                        value={formData.relationship}
                        onChange={(e) =>
                          updateField("relationship", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>

                    {/* Discussed Revolution */}
                    <div>
                      <p className={LABEL_STYLES}>
                        Have you discussed Revolution Media with them?{" "}
                        <span className="text-gold">*</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4">
                        {["Yes", "No", "Briefly mentioned"].map((option) => (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 text-sm text-midnight"
                          >
                            <input
                              type="radio"
                              name="discussedRevolution"
                              required
                              value={option}
                              checked={formData.discussedRevolution === option}
                              onChange={(e) =>
                                updateField(
                                  "discussedRevolution",
                                  e.target.value
                                )
                              }
                              className="h-4 w-4 border-midnight/20 text-gold focus:ring-gold"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Services needed */}
                    <div>
                      <p className={LABEL_STYLES}>
                        What services do you think they need?
                      </p>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {SERVICES.map((service) => (
                          <label
                            key={service}
                            className="flex cursor-pointer items-center gap-2 rounded border border-midnight/5 px-3 py-2 text-sm text-midnight transition-colors hover:border-gold/30 hover:bg-cream/50"
                          >
                            <input
                              type="checkbox"
                              checked={formData.servicesNeeded.includes(service)}
                              onChange={() => toggleService(service)}
                              className="h-4 w-4 rounded border-midnight/20 text-gold focus:ring-gold"
                            />
                            {service}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Additional context */}
                    <div>
                      <label
                        htmlFor="ref-additional-context"
                        className={LABEL_STYLES}
                      >
                        Additional context
                      </label>
                      <textarea
                        id="ref-additional-context"
                        rows={3}
                        placeholder="Any other details that could help us..."
                        value={formData.additionalContext}
                        onChange={(e) =>
                          updateField("additionalContext", e.target.value)
                        }
                        className={INPUT_STYLES}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Submit */}
                <div className="border-t border-midnight/5 pt-6">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    {submitStatus === "sending"
                      ? "Submitting..."
                      : "Submit Referral"}
                  </Button>

                  {submitStatus === "error" && (
                    <p className="mt-4 text-sm font-medium text-red-600">
                      Something went wrong. Please try again or contact support.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------
   Main exported component
   ------------------------------------------------------------------ */

export function AmbassadorPortal() {
  const [view, setView] = useState<View>("login");
  const [user, setUser] = useState<AmbassadorUser | null>(null);

  function handleLogin(email: string, _password: string) {
    // Mock auth: accept any email/password combination
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = name
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    setUser({
      name: formattedName,
      email,
      referralCode: "AMB-001",
    });
    setView("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setView("login");
  }

  return (
    <>
      {/* Hero banner */}
      <section className="relative bg-midnight py-12">
        <Container className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-[0.15em] text-gold"
          >
            Ambassadors
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-3xl font-bold text-soft-white sm:text-4xl"
          >
            Ambassador Portal
          </motion.h1>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </section>

      {/* Views */}
      {view === "login" && <LoginView onLogin={handleLogin} />}

      {view === "dashboard" && user && (
        <DashboardView
          user={user}
          onShowReferralForm={() => setView("referral-form")}
          onLogout={handleLogout}
        />
      )}

      {view === "referral-form" && user && (
        <ReferralFormView user={user} onBack={() => setView("dashboard")} />
      )}
    </>
  );
}
