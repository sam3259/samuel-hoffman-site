"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { mediaFrameStyle } from "@/components/media-sizing";
import type { ProjectImage, ProjectVideo } from "@/content/site";

type ProjectGalleryProps = {
  images: readonly ProjectImage[];
  videos?: readonly ProjectVideo[];
  projectTitle: string;
  frameAspectRatio?: number;
};

export function ProjectGallery({
  images,
  videos = [],
  projectTitle,
  frameAspectRatio,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const items = [
    ...images.map((image) => ({ kind: "image" as const, image })),
    ...videos.map((video) => ({ kind: "video" as const, video })),
  ];
  const activeItem = items[activeIndex];
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!videos.length) return;
    const frame = frameRef.current;
    if (!frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25, 0.5] },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [videos.length]);

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
      // Native controls remain available if the browser blocks autoplay.
    });

    return () => video.pause();
  }, [activeIndex, isInView]);

  if (!activeItem) return null;

  const showControls = items.length > 1;
  const itemLabel = videos.length ? "Clip" : "Image";
  const changeImage = (direction: number) => {
    setActiveIndex(
      (index) => (index + direction + items.length) % items.length,
    );
  };

  return (
    <figure
      ref={frameRef}
      className={`project-media project-reel ${frameAspectRatio ? "project-reel-fixed" : ""} ${videos.length ? "project-reel-mixed" : ""} ${activeItem.kind === "video" ? "project-reel-playing-video" : ""}`}
      style={
        frameAspectRatio
          ? { aspectRatio: `${frameAspectRatio}`, width: "min(100%, 1280px)" }
          : mediaFrameStyle(
              activeItem.kind === "image" ? activeItem.image : activeItem.video,
            )
      }
      aria-label={`${projectTitle} ${videos.length ? "media" : "image"} reel`}
      aria-roledescription="carousel"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") changeImage(-1);
        if (event.key === "ArrowRight") changeImage(1);
      }}
      onTouchStart={(event) => {
        const touch = event.changedTouches[0];
        touchStart.current = touch
          ? { x: touch.clientX, y: touch.clientY }
          : null;
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const start = touchStart.current;
        touchStart.current = null;
        if (!touch || !start) return;
        const differenceX = touch.clientX - start.x;
        const differenceY = touch.clientY - start.y;
        if (
          Math.abs(differenceX) > 50 &&
          Math.abs(differenceX) > Math.abs(differenceY)
        ) {
          changeImage(differenceX > 0 ? -1 : 1);
        }
      }}
      tabIndex={showControls ? 0 : undefined}
    >
      {activeItem.kind === "image" ? (
        <Image
          key={activeItem.image.src}
          src={activeItem.image.src}
          alt={activeItem.image.alt}
          fill
          sizes="(max-width: 800px) 100vw, 94vw"
          unoptimized={activeItem.image.src.endsWith(".gif")}
          style={{
            objectFit: activeItem.image.crop ? "cover" : "contain",
            objectPosition: activeItem.image.objectPosition,
            transform: activeItem.image.zoom
              ? `scale(${activeItem.image.zoom})`
              : undefined,
          }}
        />
      ) : (
        <video
          key={activeItem.video.src}
          ref={videoRef}
          aria-label={activeItem.video.label}
          controls
          loop
          muted
          playsInline
          poster={activeItem.video.poster || undefined}
          preload="metadata"
        >
          <source src={activeItem.video.src} type="video/mp4" />
          Your browser does not support video playback.{" "}
          <a href={activeItem.video.src}>Open the video</a>.
        </video>
      )}
      {showControls ? (
        <div className="gallery-controls" aria-label={`${itemLabel} controls`}>
          <button
            type="button"
            onClick={() => changeImage(-1)}
            aria-label={`Previous ${itemLabel.toLowerCase()} in ${projectTitle} reel`}
          >
            ←
          </button>
          <span className="gallery-progress" aria-hidden="true">
            {items.map((item, index) => (
              <i
                className={index === activeIndex ? "is-active" : ""}
                key={item.kind === "image" ? item.image.src : item.video.src}
              />
            ))}
          </span>
          <span className="sr-only" aria-live="polite">
            {itemLabel} {activeIndex + 1} of {items.length}
          </span>
          <button
            type="button"
            onClick={() => changeImage(1)}
            aria-label={`Next ${itemLabel.toLowerCase()} in ${projectTitle} reel`}
          >
            →
          </button>
        </div>
      ) : null}
    </figure>
  );
}
