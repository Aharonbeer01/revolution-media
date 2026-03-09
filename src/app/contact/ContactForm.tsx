"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";

const serviceGroups = [
  {
    label: "Marketing Packages",
    options: [
      "Visibility Package",
      "Boost Package (Paid Ads Only)",
      "Foundation Package",
      "Growth Package",
      "Performance Package",
      "Total Revenue Package",
    ],
  },
  {
    label: "Photography & Video",
    options: [
      "Essential Shoot",
      "Property Showcase",
      "Complete Visual Identity",
      "Seasonal Refresh",
      "Revolution Motion (Video)",
    ],
  },
  {
    label: "One-Time Services",
    options: [
      "Digital Presence Audit",
      "Direct Booking Strategy",
      "Content Calendar & Scripts",
      "Ad Campaign Setup",
      "Google Business Profile Overhaul",
    ],
  },
  {
    label: "Other",
    options: ["Not sure yet — help me decide"],
  },
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyName: "",
    interestedIn: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", propertyName: "", interestedIn: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyles =
    "w-full rounded border border-midnight/10 bg-warm-white px-4 py-3 text-sm text-midnight placeholder:text-midnight/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

  return (
    <div className="rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-midnight">Send Us a Message</h2>
      <p className="mt-2 text-sm text-warm-gray">
        Fill out the form below and we will get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-midnight">
            Name <span className="text-gold-deep">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-midnight">
            Email <span className="text-gold-deep">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="propertyName" className="mb-1 block text-sm font-medium text-midnight">
            Property Name <span className="text-gold-deep">*</span>
          </label>
          <input
            id="propertyName"
            type="text"
            required
            placeholder="Hotel or property name"
            value={formData.propertyName}
            onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label htmlFor="interestedIn" className="mb-1 block text-sm font-medium text-midnight">
            Interested In <span className="text-gold-deep">*</span>
          </label>
          <select
            id="interestedIn"
            required
            value={formData.interestedIn}
            onChange={(e) => setFormData({ ...formData, interestedIn: e.target.value })}
            className={`${inputStyles} ${!formData.interestedIn ? "text-midnight/40" : ""}`}
          >
            <option value="" disabled>
              Select a service or package
            </option>
            {serviceGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-midnight">
            Message <span className="text-gold-deep">*</span>
          </label>
          <textarea
            id="message"
            required
            rows={5}
            placeholder="Tell us about your property and goals..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={inputStyles}
          />
        </div>

        <Button type="submit" variant="primary" className="w-full">
          {status === "sending" ? "Sending..." : "Send Message"}
        </Button>

        {status === "success" && (
          <p className="text-center text-sm font-medium text-green-600">
            Thank you! We will be in touch soon.
          </p>
        )}

        {status === "error" && (
          <p className="text-center text-sm font-medium text-red-600">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-midnight/50">
        Or email us directly at{" "}
        <a
          href="mailto:aharon@revolutionmedia.agency"
          className="font-medium text-gold underline underline-offset-2 hover:text-gold-deep"
        >
          aharon@revolutionmedia.agency
        </a>
      </p>
    </div>
  );
}
