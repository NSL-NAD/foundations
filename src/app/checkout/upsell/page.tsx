import { Suspense } from "react";
import { UpsellContent } from "./UpsellContent";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function UpsellPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <UpsellContent />
    </Suspense>
  );
}
