"use client";

import { useEffect, useRef, useState } from "react";

import { ExternalLinkIcon } from "@/components/external-link-icon";
import { ProjectMediaBlock } from "@/components/project-media";
import { SiteNavigation } from "@/components/site-navigation";
import type { ProjectWithMedia } from "@/content/site";

type ProjectShowcaseProps = {
  projects: readonly ProjectWithMedia[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const [displayId, setDisplayId] = useState(projects[0]?.id ?? "");
  const [labelPhase, setLabelPhase] = useState<"idle" | "out" | "in">("idle");
  const [isVisible, setIsVisible] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const lastActiveIdRef = useRef(activeId);

  const activeIndex = Math.max(
    projects.findIndex((project) => project.id === activeId),
    0,
  );
  const displayProject = projects.find((project) => project.id === displayId);

  useEffect(() => {
    if (lastActiveIdRef.current === activeId) return;
    lastActiveIdRef.current = activeId;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const updateTimer = window.setTimeout(() => {
        setDisplayId(activeId);
        setLabelPhase("idle");
      }, 0);
      return () => window.clearTimeout(updateTimer);
    }

    const startTimer = window.setTimeout(() => setLabelPhase("out"), 0);
    const outTimer = window.setTimeout(() => {
      setDisplayId(activeId);
      setLabelPhase("in");
    }, 140);
    const inTimer = window.setTimeout(() => setLabelPhase("idle"), 430);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(outTimer);
      window.clearTimeout(inTimer);
    };
  }, [activeId]);

  useEffect(() => {
    const projectElements = projects
      .map((project) => document.getElementById(project.id))
      .filter((element): element is HTMLElement => element !== null);

    const projectObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-28% 0px -52% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    projectElements.forEach((element) => projectObserver.observe(element));

    const updateToolbarVisibility = () => {
      const bounds = regionRef.current?.getBoundingClientRect();
      setIsVisible(Boolean(bounds && bounds.top <= 0 && bounds.bottom > 0));
    };

    updateToolbarVisibility();
    window.addEventListener("scroll", updateToolbarVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateToolbarVisibility);

    return () => {
      projectObserver.disconnect();
      window.removeEventListener("scroll", updateToolbarVisibility);
      window.removeEventListener("resize", updateToolbarVisibility);
    };
  }, [projects]);

  const selectProject = (projectId: string) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const projectElement = document.getElementById(projectId);
    const projectHeading = projectElement?.querySelector<HTMLElement>("h2");

    window.requestAnimationFrame(() => {
      projectElement?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      projectHeading?.focus({ preventScroll: true });
    });
  };

  const goToProject = (index: number) => {
    const targetId = index < 0 ? "top" : projects[index]?.id;
    if (!targetId) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById(targetId)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section className="works" id="works" ref={regionRef}>
      {projects.map((project) => (
        <article
          className={`project project-${project.tone}`}
          id={project.id}
          key={project.id}
          data-project-title={project.title}
        >
          <div className="project-intro page-pad">
            <div className="project-copy">
              <h2 tabIndex={-1}>{project.title}</h2>
              {project.summary ? (
                <p>
                  {project.summary}
                  {project.summaryLink ? (
                    <>
                      {" "}
                      <a
                        href={project.summaryLink.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {project.summaryLink.label} <ExternalLinkIcon />
                      </a>
                    </>
                  ) : null}
                </p>
              ) : null}
              {project.role || project.year ? (
                <ul className="project-meta">
                  {project.role ? (
                    <li className="project-meta-role">{project.role}</li>
                  ) : null}
                  {project.year ? (
                    <li className="project-meta-year">{project.year}</li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          </div>

          {project.media.length ? (
            <div
              className="media-runway page-pad"
              role="group"
              aria-label={`${project.title} media`}
            >
              {project.media.map((media) => (
                <ProjectMediaBlock
                  key={media.id}
                  media={media}
                  projectTitle={project.title}
                />
              ))}
            </div>
          ) : null}
        </article>
      ))}

      <div className="works-end page-pad">
        <a href="#top">
          <span>Back</span> <strong>to top</strong>{" "}
          <span aria-hidden="true">↑</span>
        </a>
      </div>

      <div
        className={`project-toolbar ${isVisible ? "is-visible" : ""}`}
        aria-label="Project navigation"
      >
        <div className={`project-toolbar-active label-${labelPhase}`}>
          <span className="project-toolbar-title" aria-live="polite">
            <span>{displayProject?.title ?? "Projects"}</span>
          </span>
        </div>

        <div className="project-controls">
          <button
            className="project-step"
            type="button"
            aria-label={
              activeIndex === 0
                ? "Back to top"
                : `Previous project: ${projects[activeIndex - 1]?.title}`
            }
            onClick={() => goToProject(activeIndex - 1)}
          >
            ↑
          </button>
          <SiteNavigation
            projects={projects}
            currentPage="home"
            activeProjectId={activeId}
            onSelectProject={selectProject}
          />
          <button
            className="project-step"
            type="button"
            disabled={activeIndex === projects.length - 1}
            aria-label={`Next project${activeIndex < projects.length - 1 ? `: ${projects[activeIndex + 1]?.title}` : ""}`}
            onClick={() => goToProject(activeIndex + 1)}
          >
            ↓
          </button>
        </div>
      </div>
    </section>
  );
}
