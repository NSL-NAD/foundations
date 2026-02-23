"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CourseReview } from "@/components/account/CourseReview";
import { GraduationCap, Download, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/* ── Brand confetti colors ─────────────────────────────── */
const BRAND_COLORS = ["#5F7F96", "#B8593B", "#C4A44E"];

function fireConfetti() {
  const defaults = {
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
    zIndex: 9999,
  };

  // Left burst
  confetti({
    ...defaults,
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0, y: 0.65 },
  });

  // Right burst
  confetti({
    ...defaults,
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 1, y: 0.65 },
  });

  // Center shower (delayed)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 100,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0 },
    });
  }, 250);
}

/* ── Component ─────────────────────────────────────────── */

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CelebrationModal({ open, onOpenChange }: CelebrationModalProps) {
  const [studentName, setStudentName] = useState("Student");
  const [downloading, setDownloading] = useState(false);

  // Fetch student name when modal opens
  useEffect(() => {
    if (!open) return;
    async function fetchName() {
      try {
        const res = await fetch("/api/user/purchases");
        if (res.ok) {
          const data = await res.json();
          if (data.name) setStudentName(data.name);
        }
      } catch {
        // Use default
      }
    }
    fetchName();
  }, [open]);

  // Fire confetti when modal opens
  useEffect(() => {
    if (open) {
      // Small delay so the dialog is visible first
      const timer = setTimeout(fireConfetti, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadCertificate = useCallback(async () => {
    setDownloading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CertificateDocument } = await import(
        "@/components/account/CertificateDocument"
      );

      const blob = await pdf(
        <CertificateDocument
          studentName={studentName}
          completionDate={completionDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `FOA-Certificate-${studentName.replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate generation error:", err);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, [studentName, completionDate]);

  async function handleCopyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/#pricing`
        : "https://foacourse.com/#pricing";

    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {/* Gradient orb background */}
        <div className="relative overflow-hidden rounded-lg">
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#5F7F96]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-[#B8593B]/12 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C4A44E]/10 blur-3xl" />

          <div className="relative space-y-6 py-2">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brass/10">
                <GraduationCap className="h-7 w-7 text-brass" />
              </div>
              <DialogTitle className="font-heading text-3xl font-bold tracking-tight">
                Congratulations!
              </DialogTitle>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                You have completed <span className="font-semibold text-foreground">Foundations of Architecture: Designing Your Dream Space</span>. Thank you for your dedication and creativity throughout this course. Keep designing, keep learning, and keep building spaces that matter.
              </p>
            </div>

            {/* Certificate download */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold">
                    Your Certificate
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Download your personalized certificate of completion
                  </p>
                </div>
                <Button
                  onClick={handleDownloadCertificate}
                  disabled={downloading}
                  size="sm"
                  className="shrink-0"
                >
                  {downloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Review section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Leave a Review
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <CourseReview existingReview={null} compact />
            </div>

            {/* Share section */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Share with Friends
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="mb-2 text-center text-xs text-muted-foreground">
                Know someone who would love this course? Share the link below.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  Copy Course Link
                </Button>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
