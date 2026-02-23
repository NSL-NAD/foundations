"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Download,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Palette,
  Type,
  FileText,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type WizardStep =
  | "palette"
  | "font"
  | "title"
  | "firm"
  | "generating"
  | "complete";

interface BriefSection {
  title: string;
  content: string;
}

interface DesignBriefWizardProps {
  studentName: string;
  notebookEntryCount: number;
  uploadCount: number;
  existingBriefDate?: string | null;
  triggerClassName?: string;
  triggerLabel?: string;
}

// ============================================
// Color Palette Options
// ============================================
const PALETTE_OPTIONS = [
  {
    id: "classic",
    name: "Classic",
    description: "Slate blue and terracotta — timeless and professional",
    colors: ["#607D95", "#C0714A", "#1a1a1a", "#f8f9fa"],
  },
  {
    id: "warm",
    name: "Warm",
    description: "Terracotta and gold — rich and inviting",
    colors: ["#C0714A", "#C49A45", "#2c1810", "#fef7f0"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Monochrome with blue accents — clean and contemporary",
    colors: ["#1a1a1a", "#607D95", "#000000", "#f5f5f5"],
  },
];

// ============================================
// Font Style Options
// ============================================
const FONT_OPTIONS = [
  {
    id: "serif",
    name: "Serif",
    description: "Traditional and elegant",
    sample: "Design Brief",
    fontClass: "font-serif",
  },
  {
    id: "clean",
    name: "Clean",
    description: "Modern and readable",
    sample: "Design Brief",
    fontClass: "font-sans",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated and technical",
    sample: "Design Brief",
    fontClass: "font-mono",
  },
];

const STEPS: WizardStep[] = [
  "palette",
  "font",
  "title",
  "firm",
  "generating",
  "complete",
];

/* -- Gradient orb background for AI-forward feel -- */
function WizardGradientBg({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Primary orbs — darker, anchored near corners */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[22rem] w-[22rem] rounded-full bg-[#5F7F96]/55 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[#B8593B]/50 blur-[70px]" />
      <div className="pointer-events-none absolute -top-10 right-8 h-64 w-64 rounded-full bg-[#C4A44E]/40 blur-[60px]" />
      <div className="pointer-events-none absolute bottom-4 left-1/4 h-72 w-72 rounded-full bg-[#6B3FA0]/30 blur-[75px]" />
      {/* Secondary orbs — softer, offset to blend midfield */}
      <div className="pointer-events-none absolute top-16 -left-16 h-64 w-64 rounded-full bg-[#5F7F96]/25 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-10 right-16 h-56 w-56 rounded-full bg-[#B8593B]/20 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-[#C4A44E]/15 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-60 w-60 rounded-full bg-[#6B3FA0]/15 blur-[80px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function DesignBriefWizard({
  studentName,
  notebookEntryCount,
  uploadCount,
  existingBriefDate,
  triggerClassName,
  triggerLabel,
}: DesignBriefWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<WizardStep>("palette");
  const [colorPalette, setColorPalette] = useState("classic");
  const [fontStyle, setFontStyle] = useState("clean");
  const [briefTitle, setBriefTitle] = useState(
    `Design Brief — ${studentName}`
  );
  const [firmName, setFirmName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<BriefSection[]>([]);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);

  function reset() {
    setStep("palette");
    setColorPalette("classic");
    setFontStyle("clean");
    setBriefTitle(`Design Brief — ${studentName}`);
    setFirmName("");
    setError(null);
    setSections([]);
    setDownloading(null);
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(reset, 200);
    }
  }

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      const nextStep = STEPS[idx + 1];
      setStep(nextStep);
      if (nextStep === "generating") {
        handleGenerate();
      }
    }
  }

  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) {
      setStep(STEPS[idx - 1]);
    }
  }

  async function handleGenerate() {
    setError(null);
    try {
      const res = await fetch("/api/design-brief/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorPalette,
          fontStyle,
          briefTitle,
          firmName: firmName || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setSections(data.sections || []);
      setStep("complete");
    } catch (err) {
      console.error("Brief generation error:", err);
      setError("Failed to generate design brief. Please try again.");
      setStep("firm"); // Go back to last input step
    }
  }

  async function handleDownload(format: "pdf" | "docx") {
    setDownloading(format);
    try {
      const safeName = briefTitle
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");
      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (format === "pdf") {
        // Generate PDF client-side (same approach as Course Certificate)
        const { pdf, Font } = await import("@react-pdf/renderer");
        const { DesignBriefDocument } = await import("./DesignBriefDocument");

        // Register brand fonts from public directory
        Font.register({
          family: "SpaceGrotesk",
          fonts: [
            { src: "/fonts/SpaceGrotesk-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/SpaceGrotesk-Medium.ttf", fontWeight: 500 },
            { src: "/fonts/SpaceGrotesk-SemiBold.ttf", fontWeight: 600 },
            { src: "/fonts/SpaceGrotesk-Bold.ttf", fontWeight: 700 },
          ],
        });
        Font.register({
          family: "Syne",
          fonts: [
            { src: "/fonts/Syne-Regular.ttf", fontWeight: 400 },
            { src: "/fonts/Syne-Medium.ttf", fontWeight: 500 },
            { src: "/fonts/Syne-SemiBold.ttf", fontWeight: 600 },
            { src: "/fonts/Syne-Bold.ttf", fontWeight: 700 },
          ],
        });

        const blob = await pdf(
          <DesignBriefDocument
            briefTitle={briefTitle}
            firmName={firmName || undefined}
            colorPalette={colorPalette as "classic" | "warm" | "modern"}
            fontStyle={fontStyle as "serif" | "clean" | "minimal"}
            sections={sections}
            studentName={studentName}
            generatedDate={generatedDate}
          />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${safeName}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // DOCX still generated server-side (uses docx library not available client-side)
        const res = await fetch("/api/design-brief/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            format,
            briefTitle,
            firmName: firmName || undefined,
            colorPalette,
            fontStyle,
            sections,
            studentName,
            generatedDate,
          }),
        });

        if (!res.ok) throw new Error("Download failed");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${safeName}.docx`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(`Failed to download ${format.toUpperCase()}. Please try again.`);
    } finally {
      setDownloading(null);
    }
  }

  const stepIndex = STEPS.indexOf(step);
  const isCustomizationStep = stepIndex < 4; // palette, font, title, firm

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={
            triggerClassName ||
            "w-full rounded-full bg-primary-foreground px-6 text-xs font-medium uppercase tracking-wider text-primary hover:bg-primary-foreground/90"
          }
        >
          <Sparkles className="mr-2 h-3 w-3" />
          {triggerLabel ||
            (existingBriefDate
              ? "Regenerate Design Brief"
              : "Create Design Brief")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-hidden">
        <WizardGradientBg>
        {/* Step: Color Palette */}
        {step === "palette" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose a Color Palette
              </DialogTitle>
              <DialogDescription>
                Select a color scheme for your Design Brief document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 pt-2">
              {PALETTE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setColorPalette(option.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
                    colorPalette === option.id &&
                      "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <div className="flex gap-1.5">
                    {option.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border border-black/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={goNext} className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Step: Font Style */}
        {step === "font" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Choose a Font Style
              </DialogTitle>
              <DialogDescription>
                Select a typography style for your Design Brief.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 pt-2">
              {FONT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFontStyle(option.id)}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50",
                    fontStyle === option.id &&
                      "border-primary bg-primary/5 ring-1 ring-primary"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-14 w-36 items-center justify-center whitespace-nowrap rounded-lg bg-muted px-3 text-lg",
                      option.fontClass
                    )}
                  >
                    {option.sample}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <WizardNav onBack={goBack} onNext={goNext} />
          </>
        )}

        {/* Step: Brief Title */}
        {step === "title" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Brief Title
              </DialogTitle>
              <DialogDescription>
                Customize the title that appears on the cover of your Design
                Brief.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="brief-title">Title</Label>
                <Input
                  id="brief-title"
                  value={briefTitle}
                  onChange={(e) => setBriefTitle(e.target.value)}
                  placeholder="My Dream Home Design Brief"
                />
              </div>
            </div>
            <WizardNav
              onBack={goBack}
              onNext={goNext}
              nextDisabled={!briefTitle.trim()}
            />
          </>
        )}

        {/* Step: Firm Name */}
        {step === "firm" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Architect Firm (Optional)
              </DialogTitle>
              <DialogDescription>
                If you have an architect or firm you&apos;d like listed on the
                brief, enter their name here. This is optional.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="firm-name">Firm / Architect Name</Label>
                <Input
                  id="firm-name"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="e.g. Smith & Associates Architecture"
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Summary
                </p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Palette:</span>{" "}
                    {
                      PALETTE_OPTIONS.find((p) => p.id === colorPalette)?.name
                    }
                  </p>
                  <p>
                    <span className="text-muted-foreground">Font:</span>{" "}
                    {FONT_OPTIONS.find((f) => f.id === fontStyle)?.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Title:</span>{" "}
                    {briefTitle}
                  </p>
                  {firmName && (
                    <p>
                      <span className="text-muted-foreground">Firm:</span>{" "}
                      {firmName}
                    </p>
                  )}
                  <p>
                    <span className="text-muted-foreground">Notebook:</span>{" "}
                    {notebookEntryCount} {notebookEntryCount === 1 ? "entry" : "entries"}
                    {uploadCount > 0 && `, ${uploadCount} ${uploadCount === 1 ? "upload" : "uploads"}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" onClick={goBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={goNext} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate Brief
              </Button>
            </div>
          </>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Generating Your Design Brief
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We&apos;re compiling your notes, responses, and uploaded files into
              a professional Design Brief. This may take up to a minute...
            </p>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <>
            <div className="flex flex-col items-center pt-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                Your Design Brief is Ready!
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {sections.length} sections compiled from your course notes and
                responses. Download in your preferred format below.
              </p>
            </div>

            {error && (
              <div className="mx-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Section preview */}
            <div className="mx-auto max-w-md space-y-1 px-4 pt-2">
              {sections.slice(0, 4).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {s.title}
                </div>
              ))}
              {sections.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  +{sections.length - 4} more sections
                </p>
              )}
            </div>

            {/* Download buttons */}
            <div className="flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:justify-center">
              <Button
                onClick={() => handleDownload("pdf")}
                disabled={downloading !== null}
                className="gap-2"
              >
                {downloading === "pdf" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download PDF
              </Button>
              <Button
                onClick={() => handleDownload("docx")}
                disabled={downloading !== null}
                variant="outline"
                className="gap-2"
              >
                {downloading === "docx" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download DOCX
              </Button>
            </div>

            <div className="flex justify-center pt-2 pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-muted-foreground"
              >
                Close
              </Button>
            </div>
          </>
        )}

        {/* Step indicator */}
        {isCustomizationStep && (
          <div className="flex justify-center gap-1.5 pt-1">
            {STEPS.slice(0, 4).map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-colors",
                  i <= stepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
        </WizardGradientBg>
      </DialogContent>
    </Dialog>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="gap-2">
        Next
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
