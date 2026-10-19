import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

import {
  projectShells,
  type ProjectImage,
  type ProjectMedia,
  type ProjectShell,
  type ProjectVideo,
  type ProjectWithMedia,
} from "@/content/site";

const imageExtension = /\.(jpe?g|png|webp|avif)$/i;
const videoExtension = /\.mp4$/i;
const documentExtension = /\.pdf$/i;
const groupName = /^g(\d+)-(\d+)\.(jpe?g|png|webp|avif)$/i;

function mediaUrl(directory: string, filename: string) {
  return `/media/${encodeURIComponent(directory)}/${encodeURIComponent(filename)}`;
}

async function imageDimensions(path: string) {
  const metadata = await sharp(path).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Unable to read image dimensions: ${path}`);
  }

  const rotated =
    metadata.orientation &&
    metadata.orientation >= 5 &&
    metadata.orientation <= 8;
  return {
    width: rotated ? metadata.height : metadata.width,
    height: rotated ? metadata.width : metadata.height,
  };
}

async function readProjectMedia(
  project: ProjectShell,
): Promise<ProjectMedia[]> {
  if (!project.mediaDirectory) return [];

  const directoryPath = join(
    process.cwd(),
    "public",
    "media",
    project.mediaDirectory,
  );
  if (!existsSync(directoryPath)) return [];

  const filenames = readdirSync(directoryPath)
    .filter((filename) => !project.excludedMedia?.includes(filename))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const groups = new Map<number, { index: number; filename: string }[]>();
  const singles: string[] = [];
  const videos: string[] = [];
  const documents: string[] = [];

  for (const filename of filenames) {
    const match = filename.match(groupName);
    if (match) {
      const group = Number(match[1]);
      const images = groups.get(group) ?? [];
      images.push({ index: Number(match[2]), filename });
      groups.set(group, images);
    } else if (
      imageExtension.test(filename) &&
      !/-poster\.jpe?g$/i.test(filename)
    ) {
      singles.push(filename);
    } else if (videoExtension.test(filename)) {
      videos.push(filename);
    } else if (documentExtension.test(filename)) {
      documents.push(filename);
    }
  }

  const media: ProjectMedia[] = [];

  for (const [group, files] of [...groups].sort(([a], [b]) => a - b)) {
    files.sort((a, b) => a.index - b.index);
    const images: ProjectImage[] = await Promise.all(
      files.map(async ({ filename }, index) => ({
        src: mediaUrl(project.mediaDirectory!, filename),
        alt: `${project.title}, image ${index + 1} of ${files.length}`,
        ...(await imageDimensions(join(directoryPath, filename))),
        ...(project.id === "rotating-detonation-rocket-engine" && group === 1
          ? {
              crop: "square" as const,
              objectPosition:
                filename === "g1-2.webp" ? "center 35%" : "center",
            }
          : project.id === "navigator-one" &&
              group === 2 &&
              (filename === "g2-3.JPG" || filename === "g2-4.JPEG")
            ? {
                crop: "fill" as const,
                objectPosition: "center",
                zoom: filename === "g2-3.JPG" ? 1.18 : undefined,
              }
            : {}),
      })),
    );
    media.push({
      kind: "reel",
      id: `g${group}`,
      images,
      frameAspectRatio:
        project.id === "maglev"
          ? 4 / 3
          : project.id === "navigator-one" && group === 2
            ? 3 / 2
            : undefined,
    });
  }

  for (const filename of singles) {
    media.push({
      kind: "image",
      id: filename,
      image: {
        src: mediaUrl(project.mediaDirectory, filename),
        alt: `${project.title}, ${/^render/i.test(filename) ? "design rendering" : "project image"}`,
        ...(await imageDimensions(join(directoryPath, filename))),
      },
    });
  }

  const videoItems: ProjectVideo[] = await Promise.all(
    videos.map(async (filename, index) => {
      const stem = filename.replace(videoExtension, "");
      const poster = `${stem}-poster.jpg`;
      const hasPoster = filenames.includes(poster);
      return {
        src: mediaUrl(project.mediaDirectory!, filename),
        poster: hasPoster ? mediaUrl(project.mediaDirectory!, poster) : "",
        label: `${project.title} video ${index + 1}`,
        ...(hasPoster
          ? await imageDimensions(join(directoryPath, poster))
          : { width: 16, height: 9 }),
      };
    }),
  );

  if (project.id === "variable-thrust-nozzle" && videoItems.length > 1) {
    media.push({
      kind: "videoReel",
      id: "nozzle-video-reel",
      videos: [...videoItems].reverse(),
    });
  } else {
    videoItems.forEach((video) => {
      media.push({ kind: "video", id: video.src, video });
    });
  }

  const documentLabels: Record<string, string> = {
    "Penn APOP Poster 2025.pptx.pdf": "Variable Nozzle Poster 2025",
    "2024 APOP Poster.pdf": "Thrust Reverser Poster 2024",
    "navigator 1.pdf": "Navigator 1 Pitch",
  };

  for (const filename of documents) {
    media.push({
      kind: "document",
      id: filename,
      href: mediaUrl(project.mediaDirectory, filename),
      label: documentLabels[filename] ?? filename.replace(/\.pdf$/i, ""),
    });
  }

  return media;
}

export function loadProjectsWithMedia(): Promise<ProjectWithMedia[]> {
  return Promise.all(
    (projectShells as readonly ProjectShell[]).map(async (project) => ({
      ...project,
      media: await readProjectMedia(project),
    })),
  );
}
