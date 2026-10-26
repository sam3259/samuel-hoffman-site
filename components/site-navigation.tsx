"use client";

import Link from "next/link";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type NavigationProject = {
  id: string;
  title: string;
};

type SiteNavigationProps = {
  projects: readonly NavigationProject[];
  currentPage: "home" | "about";
  activeProjectId?: string;
  onSelectProject?: (projectId: string) => void;
};

export function SiteNavigation({
  projects,
  currentPage,
  activeProjectId,
  onSelectProject,
}: SiteNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [closeMenu, isOpen]);

  const selectProject = (
    event: MouseEvent<HTMLAnchorElement>,
    projectId: string,
  ) => {
    if (!onSelectProject) {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    onSelectProject(projectId);
  };

  return (
    <>
      <button
        className={`site-menu-trigger ${currentPage === "about" ? "about-menu-trigger" : "project-index-trigger"}`}
        type="button"
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-controls="site-navigation-dialog"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen
        ? createPortal(
            <div
              className="project-index-overlay"
              id="site-navigation-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              ref={dialogRef}
            >
              <nav aria-label="Site navigation">
                <Link
                  href="/about"
                  aria-current={currentPage === "about" ? "page" : undefined}
                  onClick={(event) => {
                    if (currentPage === "about") {
                      event.preventDefault();
                      closeMenu();
                    } else {
                      setIsOpen(false);
                    }
                  }}
                >
                  About Me
                </Link>
                {projects.map((project) => (
                  <Link
                    href={
                      currentPage === "home"
                        ? `#${project.id}`
                        : `/#${project.id}`
                    }
                    key={project.id}
                    aria-current={
                      currentPage === "home" && project.id === activeProjectId
                        ? "location"
                        : undefined
                    }
                    onClick={(event) => selectProject(event, project.id)}
                  >
                    {project.title}
                  </Link>
                ))}
              </nav>
              <button
                className="project-index-close"
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMenu}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
