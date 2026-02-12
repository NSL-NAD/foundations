import { Suspense } from "react";
import { CheckoutSuccessContent } from "./CheckoutSuccessContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
