import Link from "next/link";

import { ContactList } from "@/components/contact-list";
import { LocalTime } from "@/components/local-time";
import { ProjectShowcase } from "@/components/project-showcase";
import { loadProjectsWithMedia } from "@/content/media";
import { siteConfig } from "@/content/site";

export default async function HomePage() {
  const projects = await loadProjectsWithMedia();

  return (
    <main id="top">
      <section className="hero page-pad" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            I’m Sam Hoffman, a mechanical engineer building propulsion systems,
            machines, and tools that turn difficult ideas into working hardware.
          </h1>
        </div>

        <div className="hero-actions">
          <Link className="read-more" href="/about">
            Read More <span aria-hidden="true">→</span>
          </Link>
          <LocalTime timeZone={siteConfig.timezone} />
        </div>

        <ContactList />

        <div className="hero-footer">
          <a href="#works">
            <span>Scroll down</span> <strong>for projects</strong>{" "}
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <ProjectShowcase projects={projects} />
    </main>
  );
}
