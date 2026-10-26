import Image from "next/image";

import { ExternalLinkIcon } from "@/components/external-link-icon";

const experience = [
  {
    company: "Project Wavefront",
    position: "Co-Founder",
    period: "May 2025—Present",
    href: "https://www.projectwavefront.org/",
    logo: "/media/experience/project-wavefront.png",
    logoClass: "experience-logo-wavefront",
  },
  {
    company: "Penn Jet Propulsion",
    position: "Technical Advisor",
    period: "May 2025—Present",
    href: "https://aerospaceclub.engineering.upenn.edu/jet-propulsion/",
    logo: "/media/experience/penn-jet-propulsion.png",
    logoClass: "experience-logo-pjp",
  },
  {
    company: "SpaceX",
    position: "Propulsion Engineer · Raptor Chamber & Nozzle",
    period: "May—Aug 2026",
    kind: "Internship",
    href: "https://www.spacex.com/",
    logo: "/media/experience/spacex.svg",
    logoClass: "experience-logo-spacex",
  },
  {
    company: "NASA",
    position: "Propulsion Designer",
    period: "May—Aug 2025",
    kind: "Internship",
    href: "https://www.nasa.gov/",
    logo: "/media/experience/nasa.svg",
    logoClass: "experience-logo-nasa",
  },
  {
    company: "Penn Jet Propulsion",
    position: "Propulsion Systems Lead",
    period: "May 2024—May 2025",
    href: "https://aerospaceclub.engineering.upenn.edu/jet-propulsion/",
    logo: "/media/experience/penn-jet-propulsion.png",
    logoClass: "experience-logo-pjp",
  },
  {
    company: "Honeywell Aerospace",
    position: "Mechanical Engineer",
    period: "May—Aug 2024",
    kind: "Internship",
    href: "https://www.honeywellaerospace.com/",
    logo: "/media/experience/honeywell-aerospace.svg",
    logoClass: "experience-logo-honeywell",
  },
  {
    company: "Penn Jet Propulsion",
    position: "Propulsion Systems Engineer",
    period: "Sep 2023—May 2024",
    href: "https://aerospaceclub.engineering.upenn.edu/jet-propulsion/",
    logo: "/media/experience/penn-jet-propulsion.png",
    logoClass: "experience-logo-pjp",
  },
  {
    company: "FlashPCB",
    position: "Production Testing",
    period: "May—Jun 2023",
    kind: "Internship",
    href: "https://www.flashpcb.com/",
    logo: "/media/experience/flashpcb.png",
    logoClass: "experience-logo-flashpcb",
  },
] as const;

export function ExperienceTimeline() {
  return (
    <section className="experience" aria-labelledby="experience-title">
      <div className="experience-heading">
        <h2 id="experience-title">Where I&apos;ve built</h2>
      </div>
      <ol className="experience-list">
        {experience.map((role, index) => (
          <li
            className="experience-item"
            key={`${role.company}-${role.position}`}
          >
            <span className="experience-period">{role.period}</span>
            <span className="experience-rail" aria-hidden="true" />
            <a
              className="experience-card"
              href={role.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`experience-logo ${role.logoClass}`}>
                <Image src={role.logo} alt="" width={120} height={72} />
              </span>
              <div className="experience-details">
                <span className="experience-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{role.position}</h3>
                <span className="experience-company">
                  {role.company} <ExternalLinkIcon />
                </span>
                {"kind" in role ? (
                  <span className="experience-kind"> · {role.kind}</span>
                ) : null}
                <span className="experience-period-mobile">{role.period}</span>
              </div>
              <span className="experience-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
