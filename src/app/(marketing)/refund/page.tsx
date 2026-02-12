export const metadata = {
  title: "Refund Policy",
};

export default function RefundPage() {
  return (
    <div className="container max-w-3xl py-16">
      <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-muted-foreground">Last updated: February 2026</p>

      <div className="prose mt-8 max-w-none text-muted-foreground [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_li]:mb-1">
        <h2>30-Day Money-Back Guarantee</h2>
        <p>
          We want you to be completely satisfied with your purchase. If
          Foundations of Architecture isn&apos;t right for you, we offer a
          full refund within 30 days of purchase, provided you have completed
          less than 10% of the course content.
        </p>

        <h2>Course Refund Conditions</h2>
        <ul className="list-disc pl-6">
          <li>Refund must be requested within 30 days of purchase</li>
          <li>Less than 10% of course lessons must be marked as complete</li>
          <li>Refund requests should be sent via email</li>
          <li>Refunds are processed within 5-10 business days</li>
          <li>Refunds are issued to the original payment method</li>
        </ul>

        <h2>Starter Kit Refunds</h2>
        <p>
          For the physical Starter Kit (purchased individually or as a bundle):
        </p>
        <ul className="list-disc pl-6">
          <li>
            Unopened kits may be returned within 30 days for a full refund
          </li>
          <li>Return shipping costs are the responsibility of the buyer</li>
          <li>
            Bundle refunds: if the kit has been opened, only the course
            portion is refundable (subject to the 10% completion rule)
          </li>
        </ul>

        <h2>How to Request a Refund</h2>
        <p>
          To request a refund, please contact us via email with your order
          details. We&apos;ll process your request promptly and confirm once
          the refund has been initiated.
        </p>

        <h2>Exceptions</h2>
        <p>
          Refunds will not be issued after 30 days or if more than 10% of
          the course has been completed. This policy ensures fairness to all
          students while giving you ample time to evaluate the course.
        </p>
      </div>
    </div>
  );
}
