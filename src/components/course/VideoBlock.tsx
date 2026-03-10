"use client";

import { useRef, useState } from "react";
import { Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";

interface VideoBlockProps {
  src: string;
  poster?: string;
  caption?: string;
}

export function VideoBlock({ src, poster, caption }: VideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  function handlePlayPause() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function handleMuteToggle() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  function handleFullscreen() {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  }

  return (
    <figure className="my-8">
      <div
        className="group relative overflow-hidden rounded-card ring-1 ring-foreground/10"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full"
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
          }}
          controls={false}
          onClick={handlePlayPause}
        />

        {/* Custom overlay controls */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Center play button (only when paused) */}
          {!isPlaying && (
            <button
              onClick={handlePlayPause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#171C24] shadow-lg transition-transform hover:scale-105"
              aria-label="Play video"
            >
              <Play className="ml-1 h-7 w-7" />
            </button>
          )}
        </div>

        {/* Bottom control bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 transition-opacity duration-200 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handlePlayPause}
            className="text-white/90 transition-colors hover:text-white"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handleMuteToggle}
            className="text-white/90 transition-colors hover:text-white"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>

          <div className="flex-1" />

          <button
            onClick={handleFullscreen}
            className="text-white/90 transition-colors hover:text-white"
            aria-label="Fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
