import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "../components/portfolio-chrome";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Notes — Anurag" },
      { name: "description", content: "Short notes and creative observations." },
    ],
  }),
  component: Notes,
});

const notes = [
  ["On making room", "Thoughts on space, silence, and leaving a project with enough air to breathe."],
  ["The useful edge", "A small note on taste, restraint, and why the unfinished mark can feel alive."],
  ["Working slowly", "Fragments from process, research, and the beginning of a visual language."],
];

function Notes() {
  return (
    <PageShell>
      <PageHeader eyebrow="Journal" title="Notes" />
      <section className="mt-20 divide-y divide-border border-y border-border">
        {notes.map(([title, text]) => (
          <article className="grid gap-5 py-8 md:grid-cols-[.55fr_1fr]" key={title}>
            <h2 className="font-serif text-3xl">{title}</h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{text}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
