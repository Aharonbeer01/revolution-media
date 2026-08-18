import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

interface BuilderFormData {
  foundations: string[];
  addOns: string[];
  propertyName: string;
  country: string;
  rooms: string;
  website: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BuilderFormData = await request.json();

    const {
      foundations,
      addOns,
      propertyName,
      country,
      rooms,
      website,
      notes,
      name,
      email,
      phone,
    } = body;

    // A foundation selection is structurally required.
    if (!Array.isArray(foundations) || foundations.length === 0) {
      return NextResponse.json(
        { error: "Please choose at least one foundation." },
        { status: 400 }
      );
    }

    if (!propertyName || typeof propertyName !== "string" || propertyName.trim().length === 0) {
      return NextResponse.json(
        { error: "Property name is required." },
        { status: 400 }
      );
    }

    if (!country || typeof country !== "string" || country.trim().length === 0) {
      return NextResponse.json(
        { error: "Country is required." },
        { status: 400 }
      );
    }

    if (!rooms || typeof rooms !== "string" || rooms.trim().length === 0) {
      return NextResponse.json(
        { error: "Number of rooms is required." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const addOnLines =
      Array.isArray(addOns) && addOns.length > 0
        ? addOns.map((a) => `  - ${a}`)
        : ["  - None selected"];

    await sendNotificationEmail({
      subject: "New Custom Package Request - Revolution Media",
      body: [
        "A new custom package request has been submitted from the package builder.",
        "",
        "Foundation:",
        ...foundations.map((f) => `  - ${f}`),
        "",
        "Add-ons:",
        ...addOnLines,
        "",
        "Property details:",
        `  Property: ${propertyName.trim()}`,
        `  Country: ${country.trim()}`,
        `  Rooms: ${rooms.trim()}`,
        `  Website: ${website && website.trim().length > 0 ? website.trim() : "Not provided"}`,
        "",
        "Contact:",
        `  Name: ${name.trim()}`,
        `  Email: ${email.trim()}`,
        `  Phone / WhatsApp: ${phone && phone.trim().length > 0 ? phone.trim() : "Not provided"}`,
        "",
        "Notes:",
        notes && notes.trim().length > 0 ? notes.trim() : "None",
      ].join("\n"),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Got it. We'll review your property and come back within two business days with a tailored proposal.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please check your submission and try again." },
      { status: 400 }
    );
  }
}
