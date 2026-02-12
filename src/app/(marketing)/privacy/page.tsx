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
          <li>Payment information (processed securely by Stripe)</li>
          <li>Shipping address (for Starter Kit orders only)</li>
          <li>Course progress and completion data</li>
          <li>Basic usage analytics</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>To provide and maintain the course platform</li>
          <li>To process payments and fulfill orders</li>
          <li>To send transactional emails (receipts, shipping updates)</li>
          <li>To track your course progress</li>
          <li>To improve our course content and platform</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>We use the following services that may process your data:</p>
        <ul className="list-disc pl-6">
          <li>Supabase (authentication and database)</li>
          <li>Stripe (payment processing)</li>
          <li>Resend (transactional emails)</li>
          <li>Vercel (hosting)</li>
          <li>Google Analytics (usage analytics)</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data.
          Payment information is processed directly by Stripe and never stored on
          our servers.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>Contact</h2>
        <p>
          For privacy-related inquiries, please contact us at the email provided
          on the course platform.
        </p>
      </div>
    </div>
  );
}
