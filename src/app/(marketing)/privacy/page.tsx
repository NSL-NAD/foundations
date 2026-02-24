export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>

      <div className="prose mt-8 max-w-none text-muted-foreground [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
        <h2>Information We Collect</h2>
        <p>We collect the following information when you use our service:</p>
        <ul className="list-disc pl-6">
          <li>Name and email address (account creation)</li>
          <li>Payment information (processed securely by Stripe — we never store card details)</li>
          <li>Shipping address (for Starter Kit orders only)</li>
          <li>Course progress and completion data</li>
          <li>Basic usage analytics (pages visited, time on site)</li>
        </ul>

        <h2>Legal Basis for Processing</h2>
        <p>We process your personal data based on the following legal grounds:</p>
        <ul className="list-disc pl-6">
          <li><strong>Contract performance:</strong> To provide the course and services you purchased</li>
          <li><strong>Legitimate interest:</strong> To improve our platform and communicate about your account</li>
          <li><strong>Consent:</strong> For marketing communications, which you may opt out of at any time</li>
          <li><strong>Legal obligation:</strong> To comply with tax, accounting, and legal requirements</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To provide and maintain the course platform</li>
          <li>To process payments and fulfill orders</li>
          <li>To send transactional emails (receipts, shipping updates, account notices)</li>
          <li>To track your course progress</li>
          <li>To improve our course content and platform</li>
          <li>To respond to your questions or support requests</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to maintain your session, remember
          your preferences, and analyze how the platform is used. The cookies we
          use include:
        </p>
        <ul className="list-disc pl-6">
          <li><strong>Essential cookies:</strong> Required for authentication and platform functionality. These cannot be disabled.</li>
          <li><strong>Analytics cookies:</strong> Used by Google Analytics to understand usage patterns. You may opt out by using browser privacy settings or a Google Analytics opt-out extension.</li>
        </ul>
        <p>
          We do not use advertising cookies or sell data to advertisers.
        </p>

        <h2>Third-Party Services</h2>
        <p>We use the following services that may process your data:</p>
        <ul className="list-disc pl-6">
          <li><strong>Supabase</strong> — Authentication and database (data stored in the United States)</li>
          <li><strong>Stripe</strong> — Payment processing (PCI-DSS compliant)</li>
          <li><strong>Resend</strong> — Transactional emails</li>
          <li><strong>Vercel</strong> — Hosting and content delivery</li>
          <li><strong>Google Analytics</strong> — Usage analytics</li>
        </ul>
        <p>
          Each third-party provider processes data in accordance with their own
          privacy policy and applicable data protection regulations.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active or as
          needed to provide you with the Service. If you request account deletion,
          we will remove your personal data within 30 days, except where we are
          required to retain certain information for legal, tax, or accounting
          purposes.
        </p>

        <h2>International Data Transfers</h2>
        <p>
          Our services are primarily hosted in the United States. If you access the
          Service from outside the United States, your data may be transferred to
          and processed in the United States. By using the Service, you consent to
          this transfer. We take reasonable measures to ensure your data is treated
          securely and in accordance with this Privacy Policy.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data,
          including encryption in transit (TLS/SSL) and at rest. Payment
          information is processed directly by Stripe and never stored on our
          servers. While no method of data transmission is 100% secure, we take
          reasonable precautions to protect your personal information.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Request a portable copy of your data</li>
          <li>Opt out of marketing communications</li>
          <li>Withdraw consent at any time (where processing is based on consent)</li>
        </ul>

        <h2>California Privacy Rights (CCPA)</h2>
        <p>
          If you are a California resident, you have additional rights under the
          California Consumer Privacy Act (CCPA):
        </p>
        <ul className="list-disc pl-6">
          <li>The right to know what personal information we collect, use, and disclose</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to opt out of the sale of personal information — we do not sell your personal information</li>
          <li>The right to non-discrimination for exercising your CCPA rights</li>
        </ul>
        <p>
          To exercise your California privacy rights, contact us at the email
          address listed below.
        </p>

        <h2>European Privacy Rights (GDPR)</h2>
        <p>
          If you are located in the European Economic Area (EEA), you have
          additional rights under the General Data Protection Regulation (GDPR),
          including the right to lodge a complaint with your local data protection
          authority. We process your data based on the legal bases described above.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          The Service is not directed to children under the age of 13. We do not
          knowingly collect personal information from children under 13. If we
          become aware that we have collected personal data from a child under 13,
          we will take steps to delete that information promptly. If you believe a
          child under 13 has provided us with personal information, please contact
          us immediately.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Material changes
          will be communicated via email or a notice on the platform. Your
          continued use of the Service after changes are posted constitutes
          acceptance of the updated policy.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, please contact us at{" "}
          <a href="mailto:foacourse@goodatscale.co" className="text-foreground underline">
            foacourse@goodatscale.co
          </a>.
        </p>
      </div>
    </div>
  );
}
