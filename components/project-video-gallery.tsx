"use client";

import { useEffect, useRef, useState } from "react";

import { mediaFrameStyle } from "@/components/media-sizing";
import type { ProjectVideo } from "@/content/site";

type ProjectVideoGalleryProps = {
  videos: readonly ProjectVideo[];
  projectTitle: string;
};

export function ProjectVideoGallery({
  videos,
  projectTitle,
}: ProjectVideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos[activeIndex];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25, 0.5] },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (
      !isInView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // Browser autoplay restrictions leave the visible native controls available.
    });

    return () => video.pause();
  }, [activeIndex, isInView]);

  if (!activeVideo) return null;

  const changeVideo = (direction: number) => {
    setActiveIndex(
      (index) => (index + direction + videos.length) % videos.length,
    );
  };

  return (
    <figure
      ref={frameRef}
      className="project-media project-video-reel"
      style={mediaFrameStyle(activeVideo)}
      aria-label={`${projectTitle} video reel`}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") changeVideo(-1);
        if (event.key === "ArrowRight") changeVideo(1);
      }}
    >
      <video
        ref={videoRef}
        key={activeVideo.src}
        aria-label={activeVideo.label}
        controls
        loop
        muted
        playsInline
        poster={activeVideo.poster || undefined}
        preload="metadata"
      >
        <source src={activeVideo.src} type="video/mp4" />
        Your browser does not support video playback.{" "}
        <a href={activeVideo.src}>Open the video</a>.
      </video>
      <div className="gallery-controls" aria-label="Video controls">
        <button
          type="button"
          onClick={() => changeVideo(-1)}
          aria-label={`Previous video in ${projectTitle} reel`}
        >
          ←
        </button>
        <span className="gallery-progress" aria-hidden="true">
          {videos.map((video, index) => (
            <i
              className={index === activeIndex ? "is-active" : ""}
              key={video.src}
            />
          ))}
        </span>
        <span className="sr-only" aria-live="polite">
          Video {activeIndex + 1} of {videos.length}
        </span>
        <button
          type="button"
          onClick={() => changeVideo(1)}
          aria-label={`Next video in ${projectTitle} reel`}
        >
          →
        </button>
      </div>
    </figure>
  );
}
