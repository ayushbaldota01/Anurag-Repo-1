import { Link, createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/portfolio-chrome";
import { BrandsWorkedWith } from "../components/brands-worked-with";
import { PhotoGallery } from "../components/ui/gallery";

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
    <PageShell noPadding>
      <div className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-transparent">
        <div className="relative z-10 w-full text-center pointer-events-none">
          <h1 className="font-serif text-[clamp(4.5rem,12vw,9.5rem)] font-bold leading-none tracking-tighter text-white select-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/50 drop-shadow-[0_4px_30px_rgba(255,255,255,0.15)]">
              Cloxx Media
            </span>
          </h1>
        </div>
      </div>

      <section className="page-container grid grid-cols-2 gap-x-3 gap-y-10 pb-4 md:gap-x-28 md:gap-y-24 md:pb-8">
        {works.map(([title, description, type, visual], index) => (
          <article className={`group ${index % 2 ? "mt-10 md:mt-40" : ""}`} key={title}>
            <Link to="/" className="block">
              <div className={`work-visual ${visual}`}>
                <span className="view-pill">View work</span>
                <span className="work-note">Selected note: open for direction, identity and story.</span>
                <span className="mock-title">{title}</span>
              </div>
              <div className="mt-3 md:mt-5 flex flex-col sm:flex-row justify-between gap-2 md:gap-5 border-t border-border pt-3 md:pt-4">
                <div>
                  <h2 className="font-serif text-lg font-semibold leading-tight md:text-3xl">{title}</h2>
                  <p className="mt-1 md:mt-2 max-w-md text-[0.65rem] leading-4 text-muted-foreground md:text-base md:leading-6">{description}</p>
                </div>
                <p className="eyebrow pt-1 md:pt-2 text-[0.55rem] md:text-[0.72rem] hidden sm:block">{type}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>

      <div className="mt-40 mb-20 md:mt-64 md:mb-40">
        <BrandsWorkedWith />
      </div>
      
      <PhotoGallery />
    </PageShell>
  );
}
