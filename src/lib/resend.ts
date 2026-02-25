import { Resend } from "resend";

const resend = new Resend(
  (process.env.RESEND_API_KEY || "re_placeholder").trim()
);

const FROM_EMAIL =
  "Foundations of Architecture <nic@goodatscale.co>";

const REPLY_TO = "nic@goodatscale.co";

const BASE_URL = () =>
  (
    process.env.NEXT_PUBLIC_URL ||
    "https://foacourse.com"
  ).trim();

/* ─── Brand constants ─── */
const BRAND = {
  foreground: "#1A1A1A",
  primary: "#5A8299",
  accent: "#BE5B34",
  brass: "#C4A24C",
  cardBg: "#F6F5F3",
  white: "#FFFFFF",
  muted: "#6B7280",
  borderLight: "#E5E5E5",
  fontStack:
    "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
} as const;

/* ─── Bulletproof CTA button (table-based for Outlook) ─── */
function ctaButton(text: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
      <tr>
        <td style="background-color: ${BRAND.accent}; border-radius: 6px;">
          <a href="${href}" style="display: inline-block; padding: 14px 28px; font-family: ${BRAND.fontStack}; font-size: 15px; font-weight: 600; color: ${BRAND.white}; text-decoration: none;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`;
}

/* ─── Branded email layout wrapper ─── */
function brandedEmailLayout({
  preheader,
  body,
}: {
  preheader?: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foundations of Architecture</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.cardBg}; font-family: ${BRAND.fontStack};">
  ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ""}

  <!-- Outer wrapper for background color -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.cardBg};">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <!-- Inner card -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: ${BRAND.white}; border-radius: 8px; overflow: hidden;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 28px 32px 20px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- FA Monogram -->
                  <td style="width: 36px; height: 36px; border: 2px solid ${BRAND.foreground}; text-align: center; vertical-align: middle;">
                    <span style="font-family: ${BRAND.fontStack}; font-size: 13px; font-weight: 600; letter-spacing: 0.15em; color: ${BRAND.foreground};">FA</span>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <span style="font-family: ${BRAND.fontStack}; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: ${BRAND.foreground}; line-height: 1.4; display: block;">Foundations of</span>
                    <span style="font-family: ${BRAND.fontStack}; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.2em; color: ${BRAND.foreground}; line-height: 1.4; display: block;">Architecture</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Brass divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="height: 0; border-bottom: 2px solid ${BRAND.brass};"></div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 28px 32px; font-family: ${BRAND.fontStack}; font-size: 16px; line-height: 1.6; color: ${BRAND.foreground};">
              ${body}
            </td>
          </tr>

          <!-- Footer divider -->
          <tr>
            <td style="padding: 0 32px;">
              <div style="height: 0; border-bottom: 1px solid ${BRAND.borderLight};"></div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding: 20px 32px 28px 32px; font-family: ${BRAND.fontStack}; font-size: 13px; color: ${BRAND.muted}; line-height: 1.6;">
              <p style="margin: 0 0 4px 0;">&copy; ${new Date().getFullYear()} Foundations of Architecture</p>
              <p style="margin: 0;">Questions? Reply to this email and we'll help you out.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ─── Email functions ─── */

export async function sendWelcomeEmail({
  email,
  fullName,
  isUpgrade = false,
}: {
  email: string;
  fullName: string;
  isUpgrade?: boolean;
}) {
  const firstName = fullName.split(" ")[0] || "there";

  const subject = isUpgrade
    ? "Your Full Course is Unlocked!"
    : "Welcome to Foundations of Architecture!";

  const preheader = isUpgrade
    ? "Congratulations! All 11 modules and 106 lessons are now unlocked."
    : "Your account is ready. Start learning architecture fundamentals today.";

  const heading = isUpgrade
    ? `Congratulations, ${firstName}!`
    : `Welcome, ${firstName}!`;

  const intro = isUpgrade
    ? "Your full course access is now active. All 11 modules and 106 lessons are unlocked &mdash; let&rsquo;s pick up where you left off."
    : "Your Foundations of Architecture account is ready. You&rsquo;re about to learn how to think like an architect and design your dream home.";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    replyTo: REPLY_TO,
    subject,
    html: brandedEmailLayout({
      preheader,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">${heading}</h1>
        <p style="margin: 0 0 16px 0;">${intro}</p>

        <h2 style="font-size: 17px; font-weight: 600; margin: 24px 0 12px 0; color: ${BRAND.primary};">What to expect</h2>
        <ul style="padding-left: 20px; margin: 0 0 8px 0; line-height: 1.8;">
          <li><strong>106 lessons</strong> across 11 modules</li>
          <li><strong>Two learning paths</strong> &mdash; Drawer and Brief Builder</li>
          <li><strong>31 downloadable PDFs &amp; worksheets</strong></li>
          <li><strong>Lifetime access</strong> &mdash; no deadlines</li>
        </ul>

        ${ctaButton(isUpgrade ? "Continue Learning &rarr;" : "Start Learning &rarr;", `${BASE_URL()}/course`)}
      `,
    }),
  });
}

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
    ai_chat: "AI Chat — Unlimited Access",
    kit_upsell: "Architecture Starter Kit (10% Off)",
    ai_chat_upsell: "AI Chat — Unlimited Access (10% Off)",
  };

  const productLabel = productNames[productType] || productType;

  // Only show "Create Account" CTA for course/bundle (not kit-only or chat-only purchases)
  const courseSection =
    ["course", "bundle"].includes(productType)
      ? `
    <h2 style="font-size: 17px; font-weight: 600; margin: 24px 0 8px 0; color: ${BRAND.primary};">Get Started</h2>
    <p style="margin: 0 0 4px 0;">Create your account to access your course:</p>
    ${ctaButton("Create Account &rarr;", `${BASE_URL()}/signup`)}
  `
      : "";

  const kitSection = ["kit", "bundle", "kit_upsell"].includes(productType)
    ? `
    <h2 style="font-size: 17px; font-weight: 600; margin: 24px 0 8px 0; color: ${BRAND.primary};">Your Starter Kit</h2>
    <p style="margin: 0;">We'll ship your kit within 3&ndash;5 business days. You'll receive a tracking number once it ships.</p>
  `
    : "";

  const receiptLink = receiptUrl
    ? `<p style="margin-top: 24px;"><a href="${receiptUrl}" style="color: ${BRAND.primary}; text-decoration: underline;">View Receipt</a></p>`
    : "";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    replyTo: REPLY_TO,
    subject: "Your FOA Purchase Confirmation",
    html: brandedEmailLayout({
      preheader: `Thank you for purchasing ${productLabel}.`,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">Thank you for your purchase!</h1>

        <!-- Product highlight box -->
        <div style="background-color: ${BRAND.cardBg}; border-radius: 6px; padding: 16px 20px; margin-bottom: 8px; border-left: 3px solid ${BRAND.brass};">
          <p style="margin: 0; font-weight: 600;">${productLabel}</p>
        </div>

        ${courseSection}
        ${kitSection}
        ${receiptLink}
      `,
    }),
  });
}

export async function sendContactEmail({
  email,
  name,
  subject,
  message,
}: {
  email: string;
  name: string;
  subject: string;
  message: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: "nic@goodatscale.co",
    replyTo: email,
    subject: `[FOA Contact] ${subject}`,
    html: brandedEmailLayout({
      preheader: `New message from ${name}: ${subject}`,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">New Message from ${name}</h1>
        <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">From: ${name} (${email})</p>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: ${BRAND.muted};">Subject: ${subject}</p>

        <div style="padding: 16px 20px; background-color: ${BRAND.cardBg}; border-radius: 6px; border-left: 3px solid ${BRAND.primary};">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>

        <p style="margin-top: 20px; font-size: 14px; color: ${BRAND.muted};">
          Reply directly to this email to respond to the student.
        </p>
      `,
    }),
  });
}

export async function sendReviewNotification({
  studentName,
  studentEmail,
  rating,
  reviewText,
}: {
  studentName: string;
  studentEmail: string;
  rating: number;
  reviewText: string;
}) {
  const stars = "\u2605".repeat(rating) + "\u2606".repeat(5 - rating);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: "nic@goodatscale.co",
    replyTo: studentEmail,
    subject: `[FOA Review] ${stars} from ${studentName}`,
    html: brandedEmailLayout({
      preheader: `New ${rating}-star review from ${studentName}`,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">New Course Review</h1>
        <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">From: ${studentName} (${studentEmail})</p>

        <!-- Rating box -->
        <div style="background-color: ${BRAND.cardBg}; border-radius: 6px; padding: 16px 20px; margin: 16px 0; border-left: 3px solid ${BRAND.brass};">
          <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${BRAND.muted};">Rating</p>
          <p style="margin: 0; font-size: 24px; letter-spacing: 2px;">${stars}</p>
        </div>

        ${reviewText ? `
        <!-- Review text -->
        <div style="padding: 16px 20px; background-color: ${BRAND.cardBg}; border-radius: 6px; border-left: 3px solid ${BRAND.primary};">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${reviewText}</p>
        </div>
        ` : `<p style="margin: 0; font-size: 14px; color: ${BRAND.muted};">No written review provided.</p>`}
      `,
    }),
  });
}

export async function sendTrialWelcomeEmail({
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
    replyTo: REPLY_TO,
    subject: "Welcome to Foundations of Architecture — Your Free Trial",
    html: brandedEmailLayout({
      preheader:
        "Start learning with free access to the Welcome & Orientation module.",
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">Welcome, ${firstName}!</h1>
        <p style="margin: 0 0 16px 0;">Your free trial account is ready. You now have access to the <strong>Welcome &amp; Orientation</strong> module plus a preview of the <strong>Workshop Introduction</strong> &mdash; enough to explore the course platform and start your architecture journey.</p>

        <h2 style="font-size: 17px; font-weight: 600; margin: 24px 0 12px 0; color: ${BRAND.primary};">What&rsquo;s included in your trial</h2>
        <ul style="padding-left: 20px; margin: 0 0 8px 0; line-height: 1.8;">
          <li>Full access to <strong>Welcome &amp; Orientation</strong> (3 lessons)</li>
          <li><strong>Workshop Introduction</strong> preview from the Kickoff module</li>
          <li>Course Notebook to save your highlights</li>
          <li>Experience the full course platform</li>
        </ul>

        ${ctaButton("Start Learning &rarr;", `${BASE_URL()}/course`)}

        <h2 style="font-size: 17px; font-weight: 600; margin: 32px 0 12px 0; color: ${BRAND.primary};">Ready for more?</h2>
        <p style="margin: 0 0 4px 0;">Upgrade anytime to unlock all 11 modules, 106 lessons, and 31 downloadable resources.</p>

        ${ctaButton("Purchase Full Course &rarr;", `${BASE_URL()}/#pricing`)}
      `,
    }),
  });
}

export async function sendTrialSignupAdminNotification({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: "nic@goodatscale.co",
    replyTo: email,
    subject: `[FOA Trial] New signup: ${fullName}`,
    html: brandedEmailLayout({
      preheader: `${fullName} (${email}) just signed up for a free trial.`,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">New Trial Signup</h1>

        <div style="background-color: ${BRAND.cardBg}; border-radius: 6px; padding: 16px 20px; border-left: 3px solid ${BRAND.brass};">
          <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">Name</p>
          <p style="margin: 0 0 12px 0; font-weight: 600;">${fullName}</p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">Email</p>
          <p style="margin: 0; font-weight: 600;">${email}</p>
        </div>

        <p style="margin-top: 16px; font-size: 14px; color: ${BRAND.muted};">
          This user has access to the Welcome &amp; Orientation module.
          They can upgrade to the full course at any time.
        </p>

        ${ctaButton("View Admin Dashboard &rarr;", `${BASE_URL()}/admin`)}
      `,
    }),
  });
}

export async function sendPurchaseAdminNotification({
  email,
  fullName,
  productType,
  amountCents,
  isUpgrade = false,
}: {
  email: string;
  fullName: string;
  productType: string;
  amountCents: number;
  isUpgrade?: boolean;
}) {
  const productNames: Record<string, string> = {
    course: "Course Only",
    kit: "Starter Kit",
    bundle: "Course + Starter Kit",
    ai_chat: "AI Chat",
    kit_upsell: "Starter Kit (Upsell)",
    ai_chat_upsell: "AI Chat (Upsell)",
  };
  const productLabel = productNames[productType] || productType;
  const amount = (amountCents / 100).toFixed(2);
  const upgradeTag = isUpgrade ? " (Trial → Full)" : "";

  await resend.emails.send({
    from: FROM_EMAIL,
    to: "nic@goodatscale.co",
    replyTo: email || REPLY_TO,
    subject: `[FOA Order] ${productLabel}${upgradeTag} — $${amount} from ${fullName || email}`,
    html: brandedEmailLayout({
      preheader: `${fullName || email} purchased ${productLabel} for $${amount}.`,
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">New Purchase${isUpgrade ? " (Upgrade)" : ""}</h1>

        <div style="background-color: ${BRAND.cardBg}; border-radius: 6px; padding: 16px 20px; border-left: 3px solid ${BRAND.brass};">
          <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">Customer</p>
          <p style="margin: 0 0 12px 0; font-weight: 600;">${fullName || "N/A"} (${email})</p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">Product</p>
          <p style="margin: 0 0 12px 0; font-weight: 600;">${productLabel}</p>
          <p style="margin: 0 0 4px 0; font-size: 14px; color: ${BRAND.muted};">Amount</p>
          <p style="margin: 0; font-weight: 600;">$${amount} USD</p>
        </div>

        ${isUpgrade ? `<p style="margin-top: 16px; font-size: 14px; color: ${BRAND.accent}; font-weight: 600;">This student upgraded from a free trial.</p>` : ""}

        ${ctaButton("View Admin Dashboard &rarr;", `${BASE_URL()}/admin`)}
      `,
    }),
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
    replyTo: REPLY_TO,
    subject: "Your Starter Kit Has Shipped!",
    html: brandedEmailLayout({
      preheader: "Your Architecture Starter Kit is on its way!",
      body: `
        <h1 style="font-size: 24px; font-weight: 600; margin: 0 0 16px 0; color: ${BRAND.foreground};">Your kit is on its way!</h1>
        <p style="margin: 0 0 16px 0;">Great news &mdash; your Architecture Starter Kit has shipped and is heading to you.</p>

        <!-- Tracking info box -->
        <div style="background-color: ${BRAND.cardBg}; border-radius: 6px; padding: 16px 20px; border-left: 3px solid ${BRAND.brass};">
          <p style="margin: 0 0 4px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: ${BRAND.muted};">Tracking Number</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${BRAND.foreground};">${trackingNumber}</p>
        </div>

        ${trackingUrl ? ctaButton("Track Your Package &rarr;", trackingUrl) : ""}

        <p style="margin-top: 20px; color: ${BRAND.muted}; font-size: 14px;">Expected delivery: 3&ndash;7 business days</p>
      `,
    }),
  });
}
