import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { OpeningCurtain, PortfolioFooter, PortfolioNav, CursorGlow, AuroraField } from "../components/portfolio-chrome";
import { GalleryIntro } from "../components/gallery-intro";
import { ImageTrail } from "../components/ui/image-trail";

// Moody editorial images for the cursor trail — Pexels CDN, reliably available
const TRAIL_IMAGES = [
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=300",
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=300",
  "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=300",
  "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=300",
  "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300",
  "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=300",
];

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
  const [introVisible, setIntroVisible] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const handleIntroDismiss = () => {
    setIntroVisible(false);
    setTimeout(() => setIntroDone(true), 50);
  };

  return (
    <main className="page-root">
      {!introDone && <GalleryIntro onDismiss={handleIntroDismiss} />}

      <OpeningCurtain />
      <CursorGlow />
      <AuroraField />
      <PortfolioNav />

      <div
        style={{
          opacity: introDone ? 1 : 0,
          transform: introDone ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 700ms ease 100ms, transform 700ms ease 100ms',
        }}
      >
        {/* Hero section — ImageTrail follows cursor only within this container */}
        <section
          ref={heroRef}
          className="relative z-10 flex min-h-[64vh] items-center justify-center px-6 pb-16 pt-36 text-center overflow-hidden"
        >
          {/* Image trail layer — pointer-events: none so it doesn't block clicks */}
          <div className="absolute inset-0 z-0">
            <ImageTrail
              containerRef={heroRef}
              rotationRange={20}
              interval={120}
              animationSequence={[
                [{ opacity: 1, scale: 1.05 }, { duration: 0.12, ease: "circOut" }],
                [{ opacity: 0, scale: 0.6 }, { duration: 0.6, ease: "circIn" }],
              ]}
            >
              {TRAIL_IMAGES.map((url, i) => (
                <div
                  key={i}
                  style={{
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img
                    src={url}
                    alt={`Trail ${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </ImageTrail>
          </div>

          {/* Headline — sits above the trail with mix-blend for depth */}
          <h1
            className="relative z-10 font-serif font-semibold leading-none animate-fade-up"
            style={{
              fontSize: 'clamp(3.2rem,7vw,6.5rem)',
              mixBlendMode: 'exclusion',
              color: 'white',
            }}
          >
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
      </div>
    </main>
  );
}
