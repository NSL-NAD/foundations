import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL =
  "Foundations of Architecture <onboarding@resend.dev>";

export async function sendPurchaseConfirmation({
  email,
  productType,
  receiptUrl,
}: {
  email: string;
  productType: string;
  receiptUrl?: string | null;
}) {
  const productNames: Record<string, string> = {
    course: "Foundations of Architecture Course",
    kit: "Architecture Starter Kit",
    bundle: "Course + Starter Kit Bundle",
  };

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Foundations of Architecture!",
    html: `
      <div style="max-width: 560px; margin: 0 auto; font-family: system-ui, sans-serif; color: #1a1a1a;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Thank you for your purchase!</h1>
        <p>You've purchased: <strong>${productNames[productType] || productType}</strong></p>

        ${
          productType !== "kit"
            ? `
          <div style="margin-top: 24px;">
            <h2 style="font-size: 18px;">Get Started</h2>
            <p>Create your account to access your course:</p>
            <a href="${process.env.NEXT_PUBLIC_URL}/signup"
               style="display: inline-block; padding: 12px 24px; background: hsl(16, 55%, 42%); color: white; text-decoration: none; border-radius: 6px; margin-top: 8px;">
              Create Account &rarr;
            </a>
          </div>
        `
            : ""
        }

        ${
          ["kit", "bundle"].includes(productType)
            ? `
          <div style="margin-top: 24px;">
            <h2 style="font-size: 18px;">Your Starter Kit</h2>
            <p>We'll ship your kit within 3-5 business days. You'll receive a tracking number once it ships.</p>
          </div>
        `
            : ""
        }

        ${receiptUrl ? `<p style="margin-top: 24px;"><a href="${receiptUrl}">View Receipt</a></p>` : ""}

        <p style="margin-top: 32px; color: #666; font-size: 14px;">
          Questions? Reply to this email and we'll help you out.
        </p>
      </div>
    `,
  });
}

export async function sendKitShippedEmail({
  email,
  trackingNumber,
  trackingUrl,
}: {
  email: string;
  trackingNumber: string;
  trackingUrl?: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Your Starter Kit Has Shipped!",
    html: `
      <div style="max-width: 560px; margin: 0 auto; font-family: system-ui, sans-serif; color: #1a1a1a;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Your kit is on its way!</h1>
        <p>Tracking number: <strong>${trackingNumber}</strong></p>
        ${trackingUrl ? `<p><a href="${trackingUrl}" style="color: hsl(16, 55%, 42%);">Track Your Package</a></p>` : ""}
        <p>Expected delivery: 3-7 business days</p>
      </div>
    `,
  });
}
