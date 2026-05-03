import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "../components/portfolio-chrome";

export const Route = createFileRoute("/work-with-me")({
  head: () => ({
    meta: [
      { title: "Work with me — Anurag" },
      { name: "description", content: "Start a creative collaboration." },
    ],
  }),
  component: WorkWithMe,
});

const services = ["Creative direction", "Brand identity", "Editorial systems", "Campaign concepting"];

function WorkWithMe() {
  return (
    <PageShell>
      <section className="grid gap-14 md:grid-cols-[1.1fr_.9fr]">
        <PageHeader eyebrow="Collaborate" title="Work with me" />
        <p className="max-w-xl text-lg leading-8 text-muted-foreground">For founders, artists, studios, and cultural projects looking for a sharper visual voice.</p>
      </section>
      <section className="mt-24 grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div className="editorial-panel" key={s}>
            <h2 className="font-serif text-3xl">{s}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Add details, timelines, deliverables, and examples here.</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
