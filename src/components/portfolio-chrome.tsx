import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

// Per-route aurora gradient configurations (matched to the design screenshots)
type AuroraTheme = {
  c1: string; x1: string; y1: string;
  c2: string; x2: string; y2: string;
  c3: string; x3: string; y3: string;
  c4: string; x4: string; y4: string;
  base1: string; base2: string; base3: string;
};

const AURORA_THEMES: Record<string, AuroraTheme> = {
  "/": {
    // Home — deep purple-violet-blue
    c1: "oklch(0.62 0.31 285 / 0.95)", x1: "77%", y1: "10%",
    c2: "oklch(0.55 0.31 264 / 0.9)",  x2: "80%", y2: "33%",
    c3: "oklch(0.52 0.25 345 / 0.78)", x3: "72%", y3: "70%",
    c4: "oklch(0.38 0.2  355 / 0.72)", x4: "12%", y4: "88%",
    base1: "oklch(0.035 0.02 292)",
    base2: "oklch(0.055 0.045 284)",
    base3: "oklch(0.24  0.18  286)",
  },
  "/notes": {
    // Notes — vivid violet-magenta
    c1: "oklch(0.58 0.35 310 / 0.95)", x1: "75%", y1: "8%",
    c2: "oklch(0.52 0.33 295 / 0.9)",  x2: "82%", y2: "40%",
    c3: "oklch(0.48 0.28 330 / 0.8)",  x3: "65%", y3: "75%",
    c4: "oklch(0.32 0.22 320 / 0.7)",  x4: "10%", y4: "90%",
    base1: "oklch(0.03  0.02 305)",
    base2: "oklch(0.05  0.04 298)",
    base3: "oklch(0.22  0.2  308)",
  },
  "/about": {
    // About — deep ocean blue
    c1: "oklch(0.50 0.32 252 / 0.95)", x1: "80%", y1: "12%",
    c2: "oklch(0.45 0.28 240 / 0.9)",  x2: "78%", y2: "45%",
    c3: "oklch(0.42 0.22 258 / 0.78)", x3: "68%", y3: "78%",
    c4: "oklch(0.30 0.18 248 / 0.7)",  x4: "8%",  y4: "85%",
    base1: "oklch(0.03  0.03 250)",
    base2: "oklch(0.05  0.05 245)",
    base3: "oklch(0.18  0.16 252)",
  },
  "/work-with-me": {
    // Work with me — teal-emerald
    c1: "oklch(0.56 0.22 178 / 0.9)",  x1: "78%", y1: "10%",
    c2: "oklch(0.50 0.20 188 / 0.85)", x2: "75%", y2: "38%",
    c3: "oklch(0.44 0.18 200 / 0.75)", x3: "66%", y3: "72%",
    c4: "oklch(0.32 0.14 190 / 0.68)", x4: "10%", y4: "88%",
    base1: "oklch(0.03  0.02 185)",
    base2: "oklch(0.05  0.04 180)",
    base3: "oklch(0.18  0.14 182)",
  },
  "/contact": {
    // Contact — warm amber-orange
    c1: "oklch(0.58 0.18  65 / 0.9)",  x1: "76%", y1: "15%",
    c2: "oklch(0.52 0.20  55 / 0.85)", x2: "80%", y2: "42%",
    c3: "oklch(0.44 0.16  45 / 0.75)", x3: "68%", y3: "74%",
    c4: "oklch(0.32 0.12  50 / 0.68)", x4: "8%",  y4: "88%",
    base1: "oklch(0.04  0.03  62)",
    base2: "oklch(0.06  0.05  58)",
    base3: "oklch(0.20  0.14  60)",
  },
};

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

/**
 * PageShell — A standard layout wrapper for page content.
 * The global chrome (Nav, Footer, Aurora, Cursor) is now handled at the root level
 * to ensure smooth transitions and avoid unnecessary remounts.
 */
export function PageShell({ children, noPadding = false }: { children: ReactNode; noPadding?: boolean }) {
  return (
    <div className={noPadding ? "" : "page-container pt-36 md:pt-44 pb-20"}>
      {children}
    </div>
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

/** Reads the current route and smoothly cross-fades the aurora gradient. */
export function AuroraField() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const theme = AURORA_THEMES[pathname] ?? AURORA_THEMES["/"];

  // We keep two layers: "active" (visible) and "next" (hidden).
  // On route change: fade active → 0, swap props, fade back to 1.
  const [fade, setFade] = useState(1);
  const [current, setCurrent] = useState<AuroraTheme>(theme);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    if (timer.current) clearTimeout(timer.current);

    // Phase 1: fade out
    setFade(0);
    // Phase 2: after fade-out, swap gradient then fade back in
    timer.current = setTimeout(() => {
      setCurrent(AURORA_THEMES[pathname] ?? AURORA_THEMES["/"]);
      setFade(1);
    }, 350); // must match the CSS transition duration

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [pathname]);

  const style: CSSProperties = {
    "--aurora-c1": current.c1, "--aurora-x1": current.x1, "--aurora-y1": current.y1,
    "--aurora-c2": current.c2, "--aurora-x2": current.x2, "--aurora-y2": current.y2,
    "--aurora-c3": current.c3, "--aurora-x3": current.x3, "--aurora-y3": current.y3,
    "--aurora-c4": current.c4, "--aurora-x4": current.x4, "--aurora-y4": current.y4,
    "--aurora-base1": current.base1,
    "--aurora-base2": current.base2,
    "--aurora-base3": current.base3,
    opacity: fade,
    transition: "opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)",
  } as CSSProperties;

  return <div className="aurora-field" style={style} aria-hidden="true" />;
}
