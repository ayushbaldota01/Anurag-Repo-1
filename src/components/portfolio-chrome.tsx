import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const navLinks = [
  ["Works", "/"],
  ["Notes", "/notes"],
  ["About", "/about"],
  ["Work with me", "/work-with-me"],
  ["Contact", "/contact"],
] as const;

export function PortfolioNav() {
  return (
    <header className="portfolio-nav">
      <Link to="/" className="font-serif text-lg font-semibold md:text-xl">
        Anurag
      </Link>
      <nav className="hidden md:flex nav-list">
        {navLinks.map(([label, to]) => (
          <Link key={to} to={to} activeOptions={{ exact: true }} className="nav-link">
            {label}
          </Link>
        ))}
      </nav>
      <Link to="/contact" className="nav-link md:hidden">
        Contact
      </Link>
    </header>
  );
}

export function PortfolioFooter() {
  return (
    <footer className="portfolio-footer">
      <p className="font-serif text-2xl text-foreground">Anurag</p>
      <nav className="nav-list flex-wrap">
        {navLinks.map(([label, to]) => (
          <Link key={to} to={to} className="nav-link">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}

export function OpeningCurtain() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  if (gone) return null;
  return (
    <div className="opening-curtain" aria-hidden="true">
      <span className="opening-mark">Anurag</span>
    </div>
  );
}

export function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="page-root">
      <OpeningCurtain />
      <CursorGlow />
      <div className="aurora-field" aria-hidden="true" />
      <PortfolioNav />
      <div className="page-container pt-36 md:pt-44 pb-20">{children}</div>
      <PortfolioFooter />
    </main>
  );
}

export function CursorGlow() {
  const [point, setPoint] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      setPoint({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      const clickable = target?.closest?.('a, button, [role="button"], input, select, textarea');
      setIsHovering(!!clickable);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <div className={`cursor-glow ${isHovering ? "cursor-hover" : ""}`} style={{ left: point.x, top: point.y }} aria-hidden="true" />;
}
