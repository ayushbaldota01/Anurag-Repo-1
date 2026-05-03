import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { OpeningCurtain, PortfolioFooter, PortfolioNav, CursorGlow } from "../components/portfolio-chrome";

const works = [
  ["The Mirror™", "A guide to seeing your brand, and yourself, clearly.", "Book", "work-visual-a"],
  ["Wonderland", "A journey into light, colour and truth.", "Album", "work-visual-b"],
  ["Pots & Pithoi", "A world of earthy elegance and quiet prestige.", "Direction", "work-visual-c"],
  ["The Art of Becoming", "A space for thoughtful conversations.", "Podcast", "work-visual-d"],
  ["Lucy Nolan", "Where virtuosity meets visual presence.", "Direction", "work-visual-e"],
  ["Presence", "A quiet moment of clarity.", "Film", "work-visual-f"],
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Works — Portfolio Gallery" },
      { name: "description", content: "A living portfolio gallery of selected creative work." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="page-root">
      <OpeningCurtain />
      <CursorGlow />
      <div className="aurora-field" aria-hidden="true" />
      <PortfolioNav />

      <section className="relative z-10 flex min-h-[64vh] items-center justify-center px-6 pb-16 pt-36 text-center">
        <h1 className="font-serif text-[clamp(3.2rem,7vw,6.5rem)] font-semibold leading-none animate-fade-up">
          A living gallery.
        </h1>
      </section>

      <section className="page-container grid grid-cols-1 gap-x-28 gap-y-24 pb-28 md:grid-cols-2 md:pb-40">
        {works.map(([title, description, type, visual], index) => (
          <article className={`group ${index % 2 ? "md:mt-40" : ""}`} key={title}>
            <Link to="/" className="block">
              <div className={`work-visual ${visual}`}>
                <span className="view-pill">View work</span>
                <span className="work-note">Selected note: open for direction, identity and story.</span>
                <span className="mock-title">{title}</span>
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto] gap-5 border-t border-border pt-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold leading-tight md:text-3xl">{title}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground md:text-base">{description}</p>
                </div>
                <p className="eyebrow pt-2">{type}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
      <PortfolioFooter />
    </main>
  );
}

