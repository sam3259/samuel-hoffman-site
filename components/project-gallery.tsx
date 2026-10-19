"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { mediaFrameStyle } from "@/components/media-sizing";
import type { ProjectImage } from "@/content/site";

type ProjectGalleryProps = {
  images: readonly ProjectImage[];
  projectTitle: string;
  frameAspectRatio?: number;
};

export function ProjectGallery({
  images,
  projectTitle,
  frameAspectRatio,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  if (!activeImage) return null;

  const showControls = images.length > 1;
  const changeImage = (direction: number) => {
    setActiveIndex(
      (index) => (index + direction + images.length) % images.length,
    );
  };

  return (
    <figure
      className={`project-media project-reel ${frameAspectRatio ? "project-reel-fixed" : ""}`}
      style={
        frameAspectRatio
          ? { aspectRatio: `${frameAspectRatio}`, width: "min(100%, 1280px)" }
          : mediaFrameStyle(activeImage)
      }
      aria-label={`${projectTitle} image reel`}
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
      <Image
        key={activeImage.src}
        src={activeImage.src}
        alt={activeImage.alt}
        fill
        sizes="(max-width: 800px) 100vw, 94vw"
        style={{
          objectFit: activeImage.crop ? "cover" : "contain",
          objectPosition: activeImage.objectPosition,
          transform: activeImage.zoom
            ? `scale(${activeImage.zoom})`
            : undefined,
        }}
      />
      {showControls ? (
        <div className="gallery-controls" aria-label="Image controls">
          <button
            type="button"
            onClick={() => changeImage(-1)}
            aria-label={`Previous image in ${projectTitle} reel`}
          >
            ←
          </button>
          <span className="gallery-progress" aria-hidden="true">
            {images.map((image, index) => (
              <i
                className={index === activeIndex ? "is-active" : ""}
                key={image.src}
              />
            ))}
          </span>
          <span className="sr-only" aria-live="polite">
            Image {activeIndex + 1} of {images.length}
          </span>
          <button
            type="button"
            onClick={() => changeImage(1)}
            aria-label={`Next image in ${projectTitle} reel`}
          >
            →
          </button>
        </div>
      ) : null}
    </figure>
  );
}
