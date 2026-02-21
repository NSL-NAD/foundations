import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: { id: string };
}

/**
 * DELETE /api/notebook/files/{id}
 * Deletes a file record and removes the file from Supabase storage.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Fetch the file record (RLS ensures only the owner can access)
    const { data: file, error: fetchError } = await supabase
      .from("notebook_files")
      .select("id, storage_path, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Extra safety: verify ownership
    if (file.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from storage bucket
    const { error: storageError } = await supabase.storage
      .from("notebook-files")
      .remove([file.storage_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue to delete the DB record even if storage fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("notebook_files")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Notebook file delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notebook file DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
