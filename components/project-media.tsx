import Image from "next/image";

import { mediaFrameStyle } from "@/components/media-sizing";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectVideoGallery } from "@/components/project-video-gallery";
import type { ProjectMedia } from "@/content/site";

type ProjectMediaBlockProps = {
  media: ProjectMedia;
  projectTitle: string;
};

export function ProjectMediaBlock({
  media,
  projectTitle,
}: ProjectMediaBlockProps) {
  if (media.kind === "reel") {
    return (
      <ProjectGallery
        images={media.images}
        projectTitle={projectTitle}
        frameAspectRatio={media.frameAspectRatio}
      />
    );
  }

  if (media.kind === "image") {
    return (
      <figure
        className="project-media project-image"
        style={mediaFrameStyle(media.image)}
      >
        <Image
          src={media.image.src}
          alt={media.image.alt}
          fill
          sizes="(max-width: 800px) 100vw, 90vw"
          style={{ objectFit: "contain" }}
        />
      </figure>
    );
  }

  if (media.kind === "videoReel") {
    return (
      <ProjectVideoGallery videos={media.videos} projectTitle={projectTitle} />
    );
  }

  if (media.kind === "video") {
    return (
      <figure
        className="project-media project-video"
        style={mediaFrameStyle(media.video)}
      >
        <video
          aria-label={media.video.label}
          controls
          playsInline
          poster={media.video.poster || undefined}
          preload="none"
        >
          <source src={media.video.src} type="video/mp4" />
          Your browser does not support video playback.{" "}
          <a href={media.video.src}>Open the video</a>.
        </video>
        <figcaption className="sr-only">{media.video.label}</figcaption>
      </figure>
    );
  }

  return (
    <a
      className="project-document"
      href={media.href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <strong>{media.label}</strong>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
