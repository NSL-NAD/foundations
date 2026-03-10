import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gfmPlugin = remarkGfm as any;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { content } = await req.json();

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing content string" },
        { status: 400 }
      );
    }

    // Serialize MDX the same way the lesson page does
    const serialized = await serialize(content, {
      mdxOptions: { remarkPlugins: [gfmPlugin] },
    });

    return NextResponse.json({ serialized });
  } catch (error) {
    console.error("Preview serialization error:", error);
    return NextResponse.json(
      { error: "Failed to serialize MDX content" },
      { status: 500 }
    );
  }
}
