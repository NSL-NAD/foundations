export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>

      <div className="prose mt-8 max-w-none text-muted-foreground [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using Foundations of Architecture (&quot;the Service&quot;), you
          agree to be bound by these Terms of Service. If you do not agree, please
          do not use the Service.
        </p>

        <h2>2. Course Access</h2>
        <p>
          Upon purchase, you receive a personal, non-transferable license to
          access the course content. Founding students
          receive lifetime access to all current and future course content.
        </p>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6">
          <li>Share your account credentials with others</li>
          <li>Redistribute, copy, or resell course content</li>
          <li>Use automated tools to download or scrape content</li>
          <li>Use the course content for commercial training without permission</li>
        </ul>

        <h2>4. Physical Products</h2>
        <p>
          Starter Kits ship within 3-5 business days to addresses within the
          United States. Shipping times may vary. We are not responsible for
          delays caused by shipping carriers.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All course content, including text, videos, worksheets, and designs, is
          owned by NSquared Lifestyles LLC. Personal use of downloaded materials
          is permitted.
        </p>

        <h2>6. Disclaimer</h2>
        <p>
          This course is for educational purposes only. The course creator is not
          a licensed architect. Course content does not constitute professional
          architectural advice. Always consult licensed professionals for actual
          building projects.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, NSquared Lifestyles LLC shall
          not be liable for any indirect, incidental, or consequential damages
          arising from your use of the Service.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of the Service constitutes acceptance of updated terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about these terms, please contact us at the email
          provided on the course platform.
        </p>
      </div>
    </div>
  );
}
