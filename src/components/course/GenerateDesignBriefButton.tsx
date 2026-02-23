"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import { DesignBriefWizard } from "@/components/account/DesignBriefWizard";

/**
 * Self-contained button for embedding the Design Brief Wizard.
 *
 * variant="card"   — Bold card for MDX lesson content (default)
 * variant="button"  — Compact pill button for the Notebook header
 */
export function GenerateDesignBriefButton({
  variant = "card",
}: {
  variant?: "card" | "button";
}) {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [briefResponseCount, setBriefResponseCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch brief responses count
        const briefRes = await fetch("/api/design-brief");
        if (briefRes.ok) {
          const briefData = await briefRes.json();
          const responses = briefData.responses || [];
          setBriefResponseCount(responses.length);
        }

        // Fetch profile name from account data
        const accountRes = await fetch("/api/user/purchases");
        if (accountRes.ok) {
          const accountData = await accountRes.json();
          if (accountData.name) {
            setStudentName(accountData.name);
          }
        }
      } catch {
        // Fail silently — wizard will work with defaults
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* -------------------------------------------------- */
  /* Compact pill button for notebook header             */
  /* -------------------------------------------------- */
  if (variant === "button") {
    if (loading) return null; // Don't show a loader in the header

    return (
      <DesignBriefWizard
        studentName={studentName}
        briefResponseCount={briefResponseCount}
        existingBriefDate={null}
        triggerClassName="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
        triggerLabel="Generate Brief"
      />
    );
  }

  /* -------------------------------------------------- */
  /* Bold card for MDX lesson content (default)          */
  /* -------------------------------------------------- */
  if (loading) {
    return (
      <div className="not-prose flex items-center justify-center rounded-card border border-foreground/10 bg-card p-6">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="not-prose my-8 rounded-card bg-primary p-6 text-primary-foreground">
      {/* Top row: icon left, label right */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
          <ClipboardList className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
          Design Brief
        </span>
      </div>

      {/* Heading + description */}
      <h3 className="mb-1 font-heading text-lg font-semibold">
        Generate Your Design Brief
      </h3>
      <p className="mb-5 max-w-md text-sm text-primary-foreground/70">
        {briefResponseCount > 0
          ? `${briefResponseCount} notebook response${briefResponseCount !== 1 ? "s" : ""} found. Your personalized Design Brief is ready to generate.`
          : "Customize your palette, typography, and title, then let us compile your notes into a professional Design Brief."}
      </p>

      {/* Wizard trigger — brass hover */}
      <DesignBriefWizard
        studentName={studentName}
        briefResponseCount={briefResponseCount}
        existingBriefDate={null}
        triggerClassName="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:border-[#C4A44E] hover:bg-[#C4A44E] hover:text-white"
      />
    </div>
  );
}
