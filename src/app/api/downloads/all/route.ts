import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import archiver from "archiver";
import curriculum from "@/content/curriculum.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Collect all download filenames grouped by module slug
    const downloadMap: Record<string, string[]> = {};

    for (const mod of curriculum.modules) {
      for (const lesson of mod.lessons) {
        const downloads = (lesson as { downloads?: string[] }).downloads;
        if (downloads && downloads.length > 0) {
          if (!downloadMap[mod.slug]) {
            downloadMap[mod.slug] = [];
          }
          downloadMap[mod.slug].push(...downloads);
        }
      }
    }

    // Resolve file paths and filter to only files that exist
    const publicDir = path.join(process.cwd(), "public", "downloads");
    const filesToZip: { fsPath: string; zipPath: string }[] = [];

    for (const [moduleSlug, filenames] of Object.entries(downloadMap)) {
      for (const filename of filenames) {
        const fsPath = path.join(publicDir, moduleSlug, filename);
        if (fs.existsSync(fsPath)) {
          // Organize inside zip by module folder
          filesToZip.push({ fsPath, zipPath: `${moduleSlug}/${filename}` });
        }
      }
    }

    if (filesToZip.length === 0) {
      return NextResponse.json(
        { error: "No downloadable resources are available yet." },
        { status: 404 }
      );
    }

    // Create zip archive as a streaming response
    const archive = archiver("zip", { zlib: { level: 5 } });

    // Collect chunks into a buffer (archiver streams, but we need a Response)
    const chunks: Buffer[] = [];

    await new Promise<void>((resolve, reject) => {
      archive.on("data", (chunk: Buffer) => chunks.push(chunk));
      archive.on("end", () => resolve());
      archive.on("error", (err) => reject(err));

      for (const { fsPath, zipPath } of filesToZip) {
        archive.file(fsPath, { name: zipPath });
      }

      archive.finalize();
    });

    const zipBuffer = Buffer.concat(chunks);

    return new Response(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="foundations-of-architecture-resources.zip"',
        "Content-Length": String(zipBuffer.length),
      },
    });
  } catch (error) {
    console.error("Download all error:", error);
    return NextResponse.json(
      { error: "Failed to create download archive." },
      { status: 500 }
    );
  }
}
