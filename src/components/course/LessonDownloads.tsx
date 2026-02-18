import { Download } from "lucide-react";

interface LessonDownloadsProps {
  downloads: string[];
  moduleSlug: string;
}

export function LessonDownloads({ downloads, moduleSlug }: LessonDownloadsProps) {
  if (downloads.length === 0) return null;

  return (
    <div className="group flex flex-col rounded-card bg-foreground p-4 text-background transition-all duration-300 hover:bg-transparent hover:text-foreground hover:ring-2 hover:ring-foreground">
      <p className="font-heading text-xs font-semibold uppercase tracking-[0.1em]">
        Downloads
      </p>
      <div className="mt-3 space-y-2">
        {downloads.map((file) => (
          <a
            key={file}
            href={`/downloads/${moduleSlug}/${file}`}
            download
            className="flex items-center gap-2 text-sm transition-colors text-background/80 hover:text-background group-hover:text-foreground/80 group-hover:hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{file.replace('.pdf', '')}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
