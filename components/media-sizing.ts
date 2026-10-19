import type { CSSProperties } from "react";

import type { ProjectImage, ProjectVideo } from "@/content/site";

export function mediaFrameStyle(
  media: ProjectImage | ProjectVideo,
): CSSProperties {
  const ratio =
    "crop" in media && media.crop === "square" ? 1 : media.width / media.height;
  const width = Math.min(media.width, 1280, Math.round(900 * ratio));

  return {
    aspectRatio: `${ratio}`,
    width: `min(100%, ${width}px)`,
  };
}
