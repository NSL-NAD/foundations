import { Download, FolderDown } from "lucide-react";

interface LessonDownloadsProps {
  downloads: string[];
  moduleSlug: string;
}

export function LessonDownloads({ downloads, moduleSlug }: LessonDownloadsProps) {
  if (downloads.length === 0) return null;

  return (
    <div className="group flex h-full w-full flex-col rounded-card bg-foreground p-4 text-background transition-all duration-300 hover:bg-transparent hover:text-foreground hover:ring-2 hover:ring-foreground">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.1em]">
          Downloads
        </p>
        <FolderDown className="h-4 w-4 text-background/50 transition-colors group-hover:text-foreground/50" />
      </div>
      <div className="mt-auto space-y-2">
        {downloads.map((file) => (
          <a
            key={file}
            href={`/downloads/${moduleSlug}/${file}`}
            download
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all text-background/80 hover:bg-background/15 group-hover:text-foreground/80 group-hover:hover:bg-accent group-hover:hover:text-accent-foreground"
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{file.replace('.pdf', '')}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
