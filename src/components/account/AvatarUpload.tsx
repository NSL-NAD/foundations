"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl: string | null;
  fullName: string | null;
  email: string;
}

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  fullName,
  email,
}: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const initials =
    fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    email[0].toUpperCase();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit

    setUploading(true);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        console.error("Profile update error:", updateError);
        return;
      }

      setAvatarUrl(publicUrl);
      router.refresh();
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-start">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="group relative h-20 w-20 overflow-hidden rounded-full border-2 border-border transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label="Upload avatar"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile photo"
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent/10">
            <span className="font-heading text-xl font-bold text-accent">
              {initials}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </div>

        {/* Uploading spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        {uploading ? "Uploading..." : "Click to upload"}
      </p>
    </div>
  );
}
