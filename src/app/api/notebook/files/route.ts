import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILES_PER_LESSON = 5;

/**
 * GET /api/notebook/files?moduleSlug=X&lessonSlug=Y
 * If no params provided, returns all files for the user.
 * Returns files with signed URLs (private bucket).
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moduleSlug = req.nextUrl.searchParams.get("moduleSlug");
    const lessonSlug = req.nextUrl.searchParams.get("lessonSlug");

    let query = supabase
      .from("notebook_files")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (moduleSlug && lessonSlug) {
      query = query.eq("module_slug", moduleSlug).eq("lesson_slug", lessonSlug);
    } else if (moduleSlug === null && lessonSlug === null) {
      // If explicitly requesting general uploads (no lesson context)
      // handled by the caller not passing params — returns all files
    }

    const { data: files, error } = await query;

    if (error) {
      console.error("Notebook files GET error:", error);
      return NextResponse.json(
        { error: "Failed to fetch files" },
        { status: 500 }
      );
    }

    // Generate signed URLs for each file (1 hour expiry)
    const filesWithUrls = await Promise.all(
      (files || []).map(async (file) => {
        const { data: signedUrlData } = await supabase.storage
          .from("notebook-files")
          .createSignedUrl(file.storage_path, 3600);

        return {
          ...file,
          signedUrl: signedUrlData?.signedUrl || null,
        };
      })
    );

    return NextResponse.json({ files: filesWithUrls });
  } catch (error) {
    console.error("Notebook files GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notebook/files
 * Records file metadata after the client uploads to Supabase storage.
 * Body: { moduleSlug?, lessonSlug?, fileName, storagePath, fileType, fileSize }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleSlug, lessonSlug, fileName, storagePath, fileType, fileSize } =
      await req.json();

    if (!fileName || !storagePath || !fileType || !fileSize) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, storagePath, fileType, fileSize" },
        { status: 400 }
      );
    }

    // Validate file count per lesson (5 max)
    if (moduleSlug && lessonSlug) {
      const { count } = await supabase
        .from("notebook_files")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("module_slug", moduleSlug)
        .eq("lesson_slug", lessonSlug);

      if ((count || 0) >= MAX_FILES_PER_LESSON) {
        return NextResponse.json(
          {
            error: `Maximum ${MAX_FILES_PER_LESSON} files per lesson reached`,
          },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("notebook_files")
      .insert({
        user_id: user.id,
        module_slug: moduleSlug || null,
        lesson_slug: lessonSlug || null,
        file_name: fileName,
        storage_path: storagePath,
        file_type: fileType,
        file_size: fileSize,
      })
      .select()
      .single();

    if (error) {
      console.error("Notebook file insert error:", error);
      return NextResponse.json(
        { error: "Failed to save file record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ file: data });
  } catch (error) {
    console.error("Notebook files POST error:", error);
    return NextResponse.json(
      { error: "Failed to save file" },
      { status: 500 }
    );
  }
}
