import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "../components/portfolio-chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Anurag" },
      { name: "description", content: "Contact details and enquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <PageShell>
      <section className="grid gap-14 md:grid-cols-[1fr_.9fr]">
        <PageHeader eyebrow="Enquiries" title="Contact" />
        <div className="space-y-8">
          <a className="block border-t border-border py-5 font-serif text-3xl transition-colors hover:text-muted-foreground" href="mailto:hello@example.com">hello@example.com</a>
          <div className="grid gap-4 sm:grid-cols-3">
            <a className="nav-link" href="/">Instagram</a>
            <a className="nav-link" href="/">LinkedIn</a>
            <a className="nav-link" href="/">Newsletter</a>
          </div>
          <p className="max-w-md text-lg leading-8 text-muted-foreground">Use this page for email, social links, booking details, or a small enquiry form later.</p>
        </div>
      </section>
    </PageShell>
  );
}
