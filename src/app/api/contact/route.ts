import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, subject, message, type } = body;

    const recipientEmail = process.env.CONTACT_EMAIL || "samahithathero3@gmail.com";

    console.log(`[Contact Submission] To: ${recipientEmail}`, {
      type: type || "General Inquiry",
      name,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // If Formspree or custom webhook is configured in env, forward it
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail,
            name,
            phone,
            subject,
            message,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookErr) {
        console.warn("Webhook dispatch error:", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      recipient: recipientEmail,
      message: "Message received successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}
