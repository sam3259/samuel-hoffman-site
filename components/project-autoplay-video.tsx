"use client";

import { useEffect, useRef } from "react";

import { mediaFrameStyle } from "@/components/media-sizing";
import type { ProjectVideo } from "@/content/site";

type ProjectAutoplayVideoProps = {
  video: ProjectVideo;
};

export function ProjectAutoplayVideo({ video }: ProjectAutoplayVideoProps) {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const player = videoRef.current;
    if (!frame || !player) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.25 && !reducedMotion.matches) {
          void player.play().catch(() => {
            // Native controls remain available if the browser blocks autoplay.
          });
        } else {
          player.pause();
        }
      },
      { threshold: [0, 0.25, 0.5] },
    );

    observer.observe(frame);
    return () => {
      observer.disconnect();
      player.pause();
    };
  }, []);

  return (
    <figure
      ref={frameRef}
      className="project-media project-video"
      style={mediaFrameStyle(video)}
    >
      <video
        ref={videoRef}
        aria-label={video.label}
        controls
        loop
        muted
        playsInline
        poster={video.poster || undefined}
        preload="metadata"
      >
        <source src={video.src} type="video/mp4" />
        Your browser does not support video playback.{" "}
        <a href={video.src}>Open the video</a>.
      </video>
      <figcaption className="sr-only">{video.label}</figcaption>
    </figure>
  );
}
