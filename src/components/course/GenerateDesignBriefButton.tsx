"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { DesignBriefWizard } from "@/components/account/DesignBriefWizard";

/**
 * Self-contained button for embedding the Design Brief Wizard inside lesson
 * MDX content. Fetches user profile + brief data client-side so it can be
 * registered as an MDX component with zero props.
 */
export function GenerateDesignBriefButton() {
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

  if (loading) {
    return (
      <div className="not-prose flex items-center justify-center rounded-card border border-foreground/10 bg-card p-6">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="not-prose my-8 rounded-card border border-foreground/10 bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <h3 className="mb-1 font-heading text-sm font-semibold uppercase tracking-wider">
        Generate Your Design Brief
      </h3>
      <p className="mx-auto mb-4 max-w-md text-sm text-muted-foreground">
        {briefResponseCount > 0
          ? `${briefResponseCount} notebook response${briefResponseCount !== 1 ? "s" : ""} found. Your personalized Design Brief is ready to generate.`
          : "Customize your palette, typography, and title, then let us compile your notes into a professional Design Brief."}
      </p>
      <DesignBriefWizard
        studentName={studentName}
        briefResponseCount={briefResponseCount}
        existingBriefDate={null}
      />
    </div>
  );
}
