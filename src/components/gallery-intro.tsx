/**
 * GalleryIntro — Fullscreen 3D photography gallery intro shown before the works section.
 * Auto-dismisses on scroll, or via the "Enter" CTA. Fades out smoothly matching the
 * dark editorial aesthetic of the portfolio.
 */
import { useState, useEffect, useCallback } from 'react';
import InfiniteGallery from './ui/3d-gallery-photography';

// Curated editorial/artistic images matching the dark, moody portfolio vibe
const INTRO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=80',
    alt: 'Abstract colour wash',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    alt: 'Editorial portrait',
  },
  {
    src: 'https://images.unsplash.com/photo-1504700610630-ac6aba3536d3?w=1200&q=80',
    alt: 'Minimalist architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    alt: 'Geometric form',
  },
  {
    src: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=1200&q=80',
    alt: 'Dark moody landscape',
  },
  {
    src: 'https://images.unsplash.com/photo-1573481078693-e0461a51d25a?w=1200&q=80',
    alt: 'Sculptural form',
  },
  {
    src: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
    alt: 'Abstract texture',
  },
  {
    src: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=1200&q=80',
    alt: 'Creative direction',
  },
  {
    src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&q=80',
    alt: 'Graphic composition',
  },
  {
    src: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=1200&q=80',
    alt: 'Typographic study',
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
