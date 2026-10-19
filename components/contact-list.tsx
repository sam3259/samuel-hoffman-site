"use client";

import { useState } from "react";

import { siteConfig } from "@/content/site";

export function ContactList() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">(
    "idle",
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };

  return (
    <nav className="contact-list" aria-label="Contact links">
      <div className="contact-row contact-row-label">
        <span>Contact</span>
      </div>
      <div className="contact-email">
        <a className="contact-row" href={`mailto:${siteConfig.email}`}>
          <span>Email</span>
        </a>
        <button className="contact-copy" type="button" onClick={copyEmail}>
          {copyState === "copied" ? "Copied" : "Copy email"}
        </button>
        {copyState === "manual" ? (
          <span className="contact-copy-fallback" role="status">
            {siteConfig.email}
          </span>
        ) : null}
        {copyState === "copied" ? (
          <span className="sr-only" role="status">
            Email address copied to clipboard.
          </span>
        ) : null}
      </div>
      <a
        className="contact-row"
        href={siteConfig.linkedin}
        target="_blank"
        rel="noreferrer"
      >
        <span>LinkedIn</span>
      </a>
    </nav>
  );
}
