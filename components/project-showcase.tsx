"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ExternalLinkIcon } from "@/components/external-link-icon";
import { ProjectMediaBlock } from "@/components/project-media";
import type { ProjectWithMedia } from "@/content/site";

type ProjectShowcaseProps = {
  projects: readonly ProjectWithMedia[];
};

export function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const [displayId, setDisplayId] = useState(projects[0]?.id ?? "");
  const [labelPhase, setLabelPhase] = useState<"idle" | "out" | "in">("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const regionRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
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

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
  }, []);

  const selectProject = (projectId: string) => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const projectElement = document.getElementById(projectId);
    const projectHeading = projectElement?.querySelector<HTMLElement>("h2");

    setIsMenuOpen(false);
    window.requestAnimationFrame(() => {
      projectElement?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      projectHeading?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

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
          <button
            className="project-index-trigger"
            type="button"
            ref={menuTriggerRef}
            aria-expanded={isMenuOpen}
            aria-controls="project-index-dialog"
            aria-label="Open project index"
            onClick={() => setIsMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
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

      {isMenuOpen ? (
        <div
          className="project-index-overlay"
          id="project-index-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-index-title"
          ref={dialogRef}
        >
          <p id="project-index-title">Projects</p>
          <nav aria-label="Project index">
            {projects.map((project) => (
              <a
                href={`#${project.id}`}
                key={project.id}
                aria-current={project.id === activeId ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  selectProject(project.id);
                }}
              >
                <span>{project.title}</span>
              </a>
            ))}
          </nav>
          <button
            className="project-index-close"
            type="button"
            aria-label="Close project index"
            onClick={closeMenu}
          />
        </div>
      ) : null}
    </section>
  );
}
