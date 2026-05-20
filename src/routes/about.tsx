import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "../components/portfolio-chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Anurag" },
      { name: "description", content: "About the portfolio and creative practice." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <section className="grid gap-16 md:grid-cols-[1.1fr_.9fr]">
        <PageHeader eyebrow="Profile" title="About" />
        <div className="max-w-2xl space-y-7 text-lg leading-8 text-muted-foreground">
          <p>Independent creative direction for people and projects with a clear point of view.</p>
          <p>The work moves between identity, editorial systems, campaigns, books, sound, and digital spaces.</p>
        </div>
      </section>
      <section className="mt-28 grid grid-cols-1 gap-8 md:grid-cols-3">
        {["Direction", "Identity", "Story"].map((item) => (
          <div className="editorial-panel" key={item}>
            <h2 className="font-serif text-3xl">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">A short editable paragraph for your process, taste, and selected outcomes.</p>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
