"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Download, Loader2 } from "lucide-react";

interface CourseCertificateProps {
  isComplete: boolean;
  studentName: string;
  completionDate: string;
}

export function CourseCertificate({
  isComplete,
  studentName,
  completionDate,
}: CourseCertificateProps) {
  const [downloading, setDownloading] = useState(false);

  if (!isComplete) return null;

  async function handleDownload() {
    setDownloading(true);
    try {
      // Dynamic import to avoid SSR issues with @react-pdf/renderer
      const { pdf } = await import("@react-pdf/renderer");
      const { CertificateDocument } = await import("./CertificateDocument");

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
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-card border border-primary/20 bg-primary/5 p-4">
      <Award className="h-8 w-8 shrink-0 text-primary" />
      <div className="flex-1">
        <p className="font-medium">Course Complete!</p>
        <p className="text-sm text-muted-foreground">
          Download your certificate of completion
        </p>
      </div>
      <Button onClick={handleDownload} disabled={downloading} size="sm">
        {downloading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Download PDF
      </Button>
    </div>
  );
}
