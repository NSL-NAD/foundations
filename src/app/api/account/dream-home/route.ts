import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrls, description } = await req.json();

  if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
    return NextResponse.json(
      { error: "At least one image is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("dream_home_submissions").upsert(
    {
      user_id: user.id,
      image_urls: imageUrls,
      description: description || "",
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Failed to save submission:", error);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
