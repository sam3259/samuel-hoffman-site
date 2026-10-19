export const siteConfig = {
  name: "Sam Hoffman",
  title: "Sam Hoffman — Mechanical Engineer",
  description:
    "Portfolio of Sam Hoffman, a mechanical engineer working across propulsion, hardware, and technical systems.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.samuel-hoffman.com",
  email: "samhoffman83@gmail.com",
  linkedin: "https://www.linkedin.com/in/sam-hoffman/",
  timezone: "America/New_York",
} as const;

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  crop?: "square" | "fill";
  objectPosition?: string;
  zoom?: number;
};

export type ProjectVideo = {
  src: string;
  poster: string;
  label: string;
  width: number;
  height: number;
};

export type ProjectMedia =
  | {
      kind: "reel";
      id: string;
      images: readonly ProjectImage[];
      frameAspectRatio?: number;
    }
  | { kind: "image"; id: string; image: ProjectImage }
  | { kind: "videoReel"; id: string; videos: readonly ProjectVideo[] }
  | {
      kind: "video";
      id: string;
      video: ProjectVideo;
    }
  | { kind: "document"; id: string; href: string; label: string };

export type ProjectShell = {
  id: string;
  title: string;
  summary?: string;
  role?: string;
  year?: string;
  tone: "graphite" | "blue" | "sand";
  mediaDirectory?: string;
  summaryLink?: { href: string; label: string };
  excludedMedia?: readonly string[];
};

export type ProjectWithMedia = ProjectShell & {
  media: readonly ProjectMedia[];
};

export const projectShells = [
  {
    id: "rotating-detonation-rocket-engine",
    title: "Rotating Detonation Rocket Engine",
    summary:
      "An independent student propulsion program designing, analyzing, manufacturing, and testing a rotating detonation rocket engine.",
    summaryLink: {
      href: "https://projectwavefront.org",
      label: "projectwavefront.org",
    },
    excludedMedia: ["g2-1.png"],
    role: "Co-Founder & Propulsion Engineer",
    year: "2025—Present",
    tone: "graphite",
    mediaDirectory: "rotating-detonation-engine",
  },
  {
    id: "variable-thrust-nozzle",
    title: "Variable-Thrust Turbojet Nozzle",
    summary:
      "A lightweight, actuated exhaust nozzle for Penn Jet Propulsion, developed for the Air Force Research Laboratory (AFRL) under a $20k contract and recognized with the 2025 APOP Design Award.",
    role: "Team Lead",
    year: "2024—2025",
    tone: "blue",
    mediaDirectory: "variable-thrust-nozzle",
  },
  {
    id: "ducted-intake-thrust-reverser",
    title: "Ducted-Intake Jet Engine Thrust Reverser",
    summary:
      "A novel, auxiliary thrust-reversal system that won the 2024 APOP Design Creativity Award.",
    role: "Mechanical Design & Build",
    year: "2023—2024",
    tone: "sand",
    mediaDirectory: "thrust-reverser",
  },
  {
    id: "stirling-heat-engine",
    title: "Stirling Heat Engine",
    summary:
      "A 61-piece, 1,443 rpm heat engine designed in SolidWorks and machined by yours truly with manual and CNC processes.",
    role: "Design & Manufacturing",
    year: "2024",
    tone: "blue",
    mediaDirectory: "stirling-heat-engine",
  },
  {
    id: "navigator-one",
    title: "Navigator 1",
    summary:
      "An autonomous, coordinated, and affordable underwater swarm platform developed during a 48-hour maritime defense hackathon.",
    role: "Mechanical & Systems Design",
    year: "2026",
    tone: "graphite",
    mediaDirectory: "navigator",
  },
  {
    id: "bauhaus-chess-set",
    title: "Bauhaus Chess Set",
    summary:
      "A CNC machined chess set with anodized pieces and floating checkerboard concept, inspired by Bauhaus style.",
    role: "Design & Manufacturing",
    year: "2024",
    tone: "blue",
    mediaDirectory: "bauhaus-chess-set",
  },
  {
    id: "maglev",
    title: "Maglev Train Model",
    summary:
      "A ~3 ft model maglev train prototype using homemade tracks, carts, and electronics that drives left/right.",
    role: "Design and Build",
    year: "2026",
    tone: "sand",
    mediaDirectory: "maglev",
  },
] as const satisfies readonly ProjectShell[];
