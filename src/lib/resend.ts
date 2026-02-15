import { Resend } from "resend";

const resend = new Resend(
  (process.env.RESEND_API_KEY || "re_placeholder").trim()
);

const FROM_EMAIL =
  "Foundations of Architecture <onboarding@resend.dev>";

const BASE_URL = () =>
  (
    process.env.NEXT_PUBLIC_URL ||
    "https://foundations-of-architecture.vercel.app"
  ).trim();

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
    subject: "Your FOA Purchase Confirmation",
    html: `
      <div style="max-width: 560px; margin: 0 auto; font-family: system-ui, sans-serif; color: #1a1a1a;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Thank you for your purchase!</h1>
        <p>You've purchased: <strong>${productNames[productType] || productType}</strong></p>

        ${
          productType !== "kit"
            ? `
          <div style="margin-top: 24px;">
            <h2 style="font-size: 18px;">Get Started</h2>
            <p>If you haven't already, create your account to access your course:</p>
            <a href="${BASE_URL()}/signup"
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

export async function sendWelcomeEmail({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  const firstName = fullName.split(" ")[0] || "there";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Welcome to Foundations of Architecture!",
    html: `
      <div style="max-width: 560px; margin: 0 auto; font-family: system-ui, sans-serif; color: #1a1a1a;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Welcome, ${firstName}! 🏠</h1>

        <p>Your Foundations of Architecture account is ready. You're about to learn how to think like an architect and design your dream home.</p>

        <div style="margin-top: 24px;">
          <h2 style="font-size: 18px;">What to expect</h2>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li><strong>62 lessons</strong> across 10 modules</li>
            <li><strong>Two learning paths</strong> — Drawer (hands-on sketching) and Brief Builder (written briefs)</li>
            <li><strong>34 downloadable resources</strong> — worksheets, templates, and guides</li>
            <li><strong>Go at your own pace</strong> — lifetime access, no deadlines</li>
          </ul>
        </div>

        <div style="margin-top: 24px;">
          <a href="${BASE_URL()}/dashboard"
             style="display: inline-block; padding: 12px 24px; background: hsl(16, 55%, 42%); color: white; text-decoration: none; border-radius: 6px;">
            Start Learning &rarr;
          </a>
        </div>

        <p style="margin-top: 32px; color: #666; font-size: 14px;">
          Need help getting started? Reply to this email — we're happy to help.
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
