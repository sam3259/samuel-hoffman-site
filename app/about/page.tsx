import Image from "next/image";
import Link from "next/link";

import { ContactList } from "@/components/contact-list";
import { siteConfig } from "@/content/site";

export const metadata = {
  title: "About Me",
  description: `About ${siteConfig.name}, a mechanical engineer interested in aerospace, propulsion, and hands-on problem solving.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="about-page" id="top">
      <header className="about-header page-pad">
        <Link href="/#works">← Back to Works</Link>
        <span>{siteConfig.name}</span>
      </header>

      <section className="about-shell page-pad" aria-labelledby="about-title">
        <p>Profile</p>
        <h1 id="about-title">About Me</h1>
        <div className="about-copy">
          <p>
            Hello, I’m Sam—a mechanical engineer who loves anything that flies.
            I’m especially drawn to aerospace, propulsion, and turning ideas
            into working hardware. With a BSE and MSE in mechanical engineering
            from UPenn, I&apos;ll be working as a Propulsion Engineer at SpaceX.
          </p>
          <p>
            I’m a nimble problem solver who moves between analysis, prototyping,
            and hands-on testing to find practical answers when the path isn’t
            obvious. I build trust on teams, ask questions, and learn from the
            people around me.
          </p>
          <p>
            Outside of engineering, you’ll usually find me skiing, cooking,
            camping, biking, or following F1/baseball/football.
          </p>
        </div>
        <nav className="about-documents" aria-label="About Me documents">
          <a
            href="/documents/sam-hoffman-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Resume</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            href="/documents/sam-hoffman-coursework.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Coursework</span>
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <div className="about-photos" aria-label="Photos of Sam at work">
          <figure className="about-photo-testing">
            <Image
              src="/media/about-me/testing.jpg"
              alt="Sam and a teammate working on a small jet engine in a test facility"
              width={4608}
              height={3456}
              sizes="(max-width: 800px) 100vw, 42vw"
            />
          </figure>
          <figure className="about-photo-presenting">
            <Image
              src="/media/about-me/J1J09054.JPG"
              alt="Sam presenting an engineering project at a podium"
              width={2851}
              height={1901}
              sizes="(max-width: 800px) 100vw, 52vw"
            />
          </figure>
        </div>
      </section>

      <footer className="about-footer page-pad">
        <ContactList />
        <div className="works-end about-back-to-top">
          <a href="#top">
            <span>Back</span> <strong>to top</strong>{" "}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
