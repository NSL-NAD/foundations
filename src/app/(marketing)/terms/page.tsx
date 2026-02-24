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
          By accessing or using Foundations of Architecture (&quot;the Service&quot;),
          operated by NSquared Lifestyles LLC, you agree to be bound by these Terms
          of Service. If you do not agree, please do not use the Service.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years of age to create an account or purchase the
          course. By using the Service, you represent and warrant that you meet this
          age requirement.
        </p>

        <h2>3. Course Access</h2>
        <p>
          Upon purchase, you receive a personal, non-transferable license to
          access the course content. Founding students receive lifetime access to
          all current and future course content.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6">
          <li>Share your account credentials with others</li>
          <li>Redistribute, copy, or resell course content</li>
          <li>Use automated tools to download or scrape content</li>
          <li>Use the course content for commercial training without permission</li>
        </ul>

        <h2>5. Physical Products</h2>
        <p>
          Starter Kits ship within 3-5 business days to addresses within the
          United States. Shipping times may vary. We are not responsible for
          delays caused by shipping carriers.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All course content, including text, videos, worksheets, and designs, is
          owned by NSquared Lifestyles LLC. Personal use of downloaded materials
          is permitted. Commercial use or redistribution is prohibited without
          prior written consent.
        </p>

        <h2>7. Disclaimer</h2>
        <p>
          This course is for educational purposes only. The course creator is not
          a licensed architect. Course content does not constitute professional
          architectural advice. Always consult licensed professionals for actual
          building projects.
        </p>

        <h2>8. Warranty Disclaimer</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without warranties of any kind, either express or implied, including but
          not limited to implied warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that the
          Service will be uninterrupted, error-free, or free of viruses or other
          harmful components.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, NSquared Lifestyles LLC shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of the Service, including but not
          limited to loss of profits, data, or goodwill, even if we have been
          advised of the possibility of such damages.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless NSquared Lifestyles LLC
          and its officers, employees, and agents from any claims, damages, losses,
          liabilities, and expenses (including reasonable legal fees) arising out of
          your use of the Service or violation of these Terms.
        </p>

        <h2>11. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the Service
          at any time if you violate these Terms. Upon termination, your right to
          use the Service will cease immediately. Provisions that by their nature
          should survive termination will remain in effect.
        </p>

        <h2>12. Dispute Resolution</h2>
        <p>
          Any dispute arising from or relating to these Terms or the Service shall
          first be resolved through good-faith negotiation. If the dispute cannot
          be resolved within 30 days, it shall be submitted to binding arbitration
          in accordance with the rules of the American Arbitration Association.
          Arbitration shall take place in Wisconsin, United States.
        </p>

        <h2>13. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Wisconsin, United States, without regard to its
          conflict of law provisions.
        </p>

        <h2>14. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or invalid,
          that provision will be limited or eliminated to the minimum extent
          necessary, and the remaining provisions will remain in full force and
          effect.
        </p>

        <h2>15. Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time. Material changes
          will be communicated via email or a notice on the platform. Continued use
          of the Service after changes are posted constitutes acceptance of the
          updated terms.
        </p>

        <h2>16. Contact</h2>
        <p>
          For questions about these terms, please contact us at{" "}
          <a href="mailto:foacourse@goodatscale.co" className="text-foreground underline">
            foacourse@goodatscale.co
          </a>.
        </p>
      </div>
    </div>
  );
}
