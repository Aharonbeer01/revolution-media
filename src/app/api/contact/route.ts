import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

interface ContactFormData {
  name: string;
  email: string;
  propertyName: string;
  interestedIn: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    const { name, email, propertyName, interestedIn, message } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!propertyName || typeof propertyName !== "string" || propertyName.trim().length === 0) {
      return NextResponse.json(
        { error: "Property name is required." },
        { status: 400 }
      );
    }

    if (!interestedIn || typeof interestedIn !== "string" || interestedIn.trim().length === 0) {
      return NextResponse.json(
        { error: "Please select a service or package." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    // Send notification email
    await sendNotificationEmail({
      subject: "New Contact Form Submission — Revolution Media",
      body: [
        "A new contact form submission has been received.",
        "",
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Property: ${propertyName.trim()}`,
        `Interested In: ${interestedIn.trim()}`,
        "",
        "Message:",
        message.trim(),
      ].join("\n"),
    });

    return NextResponse.json(
      { success: true, message: "Thank you for your message. We will be in touch shortly." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please check your submission and try again." },
      { status: 400 }
    );
  }
}
