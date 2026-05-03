/**
 * GalleryIntro — Fullscreen 3D photography gallery intro shown before the works section.
 * Auto-dismisses on scroll, or via the "Enter" CTA. Fades out smoothly matching the
 * dark editorial aesthetic of the portfolio.
 */
import { useState, useEffect, useCallback } from 'react';
import InfiniteGallery from './ui/3d-gallery-photography';

// Curated editorial/artistic images — using Pexels CDN for reliable WebGL texture loading
const INTRO_IMAGES = [
  {
    src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Mountain landscape',
  },
  {
    src: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Ocean waves',
  },
  {
    src: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Forest path',
  },
  {
    src: 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Desert dunes',
  },
  {
    src: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'City skyline',
  },
  {
    src: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Northern lights',
  },
  {
    src: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Waterfall',
  },
  {
    src: 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Sunset beach',
  },
  {
    src: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Abstract light',
  },
  {
    src: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Misty mountains',
  },
];

interface GalleryIntroProps {
  onDismiss: () => void;
}

export function GalleryIntro({ onDismiss }: GalleryIntroProps) {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    // Let the fade-out CSS transition run before fully removing
    setTimeout(onDismiss, 700);
  }, [exiting, onDismiss]);

  // Dismiss on any scroll down
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) dismiss();
    };
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'Enter', ' '].includes(e.key)) dismiss();
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [dismiss]);

  return (
    <div
      aria-hidden={exiting}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'oklch(0.04 0.025 292)',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* 3D gallery fills the screen */}
      <InfiniteGallery
        images={INTRO_IMAGES}
        speed={1.1}
        visibleCount={12}
        className="absolute inset-0 w-full h-full"
        fadeSettings={{
          fadeIn: { start: 0.05, end: 0.2 },
          fadeOut: { start: 0.8, end: 0.95 },
        }}
        blurSettings={{
          blurIn: { start: 0.0, end: 0.08 },
          blurOut: { start: 0.88, end: 1.0 },
          maxBlur: 5.0,
        }}
      />

      {/* Headline overlay — mix-blend-mode exclusion gives the light-over-dark inversion */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          mixBlendMode: 'exclusion',
        }}
      >
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            fontWeight: 600,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            padding: '0 1.5rem',
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'translateY(-12px)' : 'translateY(0)',
            transition: 'opacity 500ms ease, transform 500ms ease',
          }}
        >
          A living gallery.
        </h1>
      </div>

      {/* Bottom hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: exiting ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
      >
        {/* Scroll cue — animated chevron */}
        <button
          onClick={dismiss}
          aria-label="Enter gallery"
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '999px',
            padding: '0.6rem 1.4rem',
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            background: 'oklch(0.13 0.05 286 / 40%)',
            transition: 'color 220ms ease, border-color 220ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.18)';
          }}
        >
          Enter
        </button>
        <p
          style={{
            fontSize: '0.62rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          Scroll to explore
        </p>
      </div>
    </div>
  );
}
