'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

/* ─── PROJECT DATA ─── */
const PROJECTS = [
    {
        id: '01',
        title: 'Urvashi Rautela',
        category: 'Creative Strategy',
        client: 'Digital Presence',
        year: '2024',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
        accent: '#8B6914',
        verticalLabel: 'PORTRAIT',
    },
    {
        id: '02',
        title: 'Varun Dhawan',
        category: 'Interviews & Events',
        client: 'GQ India',
        year: '2023',
        src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop',
        accent: '#4A7C8B',
        verticalLabel: 'EDITORIAL',
    },
    {
        id: '03',
        title: 'Tiger Shroff',
        category: 'Interviews & Events',
        client: 'GQ India',
        year: '2024',
        src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop',
        accent: '#6B8B4A',
        verticalLabel: 'FEATURE',
    },
    {
        id: '04',
        title: 'Celebrity Feature',
        category: 'Premium Editorial',
        client: 'Fashion Brand',
        year: '2024',
        src: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1600&auto=format&fit=crop',
        accent: '#8B4A7C',
        verticalLabel: 'FASHION',
    },
    {
        id: '05',
        title: 'Artist Portrait',
        category: 'Exclusive Session',
        client: 'Private Commission',
        year: '2024',
        src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=1600&auto=format&fit=crop',
        accent: '#C4A77D',
        verticalLabel: 'ARTIST',
    },
];

const TOTAL = PROJECTS.length;
const ROTATIONS = [3, -4, 2.5, -3]; // organic alternating tilt for cards 1–4

/* ═══════════════════════════════════════════════════════════════ */

export default function SelectedWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            /* ──────── DESKTOP — Cinematic Pinned Stack ──────── */
            mm.add('(min-width: 768px)', () => {
                const cards = gsap.utils.toArray<HTMLElement>('.crazy-card');
                if (cards.length === 0) return;

                // ── Initial States ──
                // Card 0: already resting, fully visible
                gsap.set(cards[0], {
                    yPercent: 0,
                    scale: 1,
                    rotationZ: 0,
                    rotationX: 0,
                    opacity: 1,
                    zIndex: 10,
                });

                // Cards 1–4: off-screen below, slightly rotated, invisible
                cards.slice(1).forEach((card, i) => {
                    gsap.set(card, {
                        yPercent: 110,
                        scale: 0.88,
                        rotationZ: ROTATIONS[i] ?? 0,
                        rotationX: 0,
                        opacity: 0,
                        zIndex: i + 11,
                        transformOrigin: 'center bottom',
                    });
                });

                // Set initial metadata/label states for cards 1–4 to hidden
                for (let i = 1; i < TOTAL; i++) {
                    gsap.set(`.card-meta-${i}`, { x: -40, opacity: 0 });
                    gsap.set(`.card-label-${i}`, { opacity: 0, x: -8 });
                }

                // Progress bar initial
                gsap.set('.scroll-progress-fill', { scaleX: 1 / TOTAL });

                // ── Master Timeline ──
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: () => `+=${(TOTAL - 1) * 100}%`,
                        pin: true,
                        pinSpacing: true,
                        scrub: 1.4,
                        anticipatePin: 1,
                    },
                });

                // ── Per-Card Animation Sequence ──
                for (let i = 1; i < TOTAL; i++) {
                    const card = cards[i];
                    const project = PROJECTS[i];
                    const t = i; // absolute timeline position

                    // 1. Bring current card IN — emerges from below
                    tl.to(card, {
                        yPercent: 0,
                        scale: 1,
                        rotationZ: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                    }, t);

                    // 2. Push ALL previously visible cards back
                    for (let p = 0; p < i; p++) {
                        const depthLevel = i - p;
                        tl.to(cards[p], {
                            scale: 1 - depthLevel * 0.04,
                            yPercent: -(depthLevel * 6),
                            opacity: 1 - depthLevel * 0.18,
                            rotationX: depthLevel * 1.5,
                            duration: 1,
                            ease: 'power2.inOut',
                        }, t);
                    }

                    // 3. Counter flip animation
                    tl.to(counterRef.current, {
                        opacity: 0,
                        y: -12,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            if (counterRef.current) {
                                counterRef.current.textContent = `${project.id} / 0${TOTAL}`;
                            }
                        },
                    }, t + 0.1);

                    tl.to(counterRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                    }, t + 0.4);

                    // 4. Slide metadata in from left
                    tl.fromTo(`.card-meta-${i}`, {
                        x: -40,
                        opacity: 0,
                    }, {
                        x: 0,
                        opacity: 1,
                        duration: 0.7,
                        ease: 'power3.out',
                    }, t + 0.25);

                    // 5. Fade vertical side label in
                    tl.fromTo(`.card-label-${i}`, {
                        opacity: 0,
                        x: -8,
                    }, {
                        opacity: 0.35,
                        x: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    }, t + 0.3);

                    // 6. Update scroll progress bar
                    tl.to('.scroll-progress-fill', {
                        scaleX: (i + 1) / TOTAL,
                        duration: 1,
                        ease: 'none',
                    }, t);
                }
            });

            /* ──────── MOBILE — Graceful Vertical Scroll ──────── */
            mm.add('(max-width: 767px)', () => {
                gsap.utils.toArray<HTMLElement>('.crazy-card-mobile').forEach((card) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.9,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 85%',
                            },
                        }
                    );
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-[#030303] text-white overflow-hidden"
        >
            {/* ── Section Header Labels ── */}
            <div className="absolute top-[4vh] left-[4vw] z-50 font-accent text-[10px] tracking-[0.15em] uppercase text-white/50 pointer-events-none">
                <span className="opacity-40 mr-3">(SELECTED WORKS)</span>
                THE ARCHIVE
            </div>

            <div className="absolute top-[4vh] right-[4vw] z-50 font-accent text-[10px] tracking-[0.15em] uppercase text-white/50 pointer-events-none">
                SCROLL TO IMMERSE
            </div>

            {/* ── Progress Counter — Top Center ── */}
            <div
                ref={counterRef}
                className="absolute top-[4vh] left-1/2 -translate-x-1/2 z-50 font-accent text-[11px] tracking-[0.25em] text-white/60 uppercase pointer-events-none"
            >
                01 / 0{TOTAL}
            </div>

            {/* ════════════════════════════════════════════════════════ */}
            {/*  DESKTOP — Perspective Stack Viewport                  */}
            {/* ════════════════════════════════════════════════════════ */}
            <div
                ref={wrapperRef}
                className="hidden md:block absolute inset-0 w-full h-full"
                style={{
                    perspective: '1400px',
                    perspectiveOrigin: '50% 50%',
                    transformStyle: 'preserve-3d',
                }}
            >
                {PROJECTS.map((project, index) => (
                    <div
                        key={project.id}
                        className="crazy-card absolute inset-0 w-full h-full overflow-hidden"
                        style={{ zIndex: index + 10, transformOrigin: 'center bottom' }}
                        onMouseEnter={() => setCursorMode('view')}
                        onMouseLeave={() => setCursorMode('default')}
                    >
                        {/* Full Bleed Image */}
                        <img
                            src={project.src}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            style={{ opacity: 0.75, filter: 'brightness(0.85) contrast(1.05)' }}
                        />

                        {/* Gradient Overlay — Bottom Heavy */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 pointer-events-none" />

                        {/* Vertical Side Label */}
                        <div
                            className={`card-label-${index} absolute left-6 top-1/2 font-accent text-[10px] tracking-[0.4em] text-white/35 uppercase pointer-events-none select-none`}
                            style={{
                                writingMode: 'vertical-rl',
                                transform: 'translateY(-50%) rotate(180deg)',
                            }}
                        >
                            {project.verticalLabel}
                        </div>

                        {/* Ghost Number — Top Right */}
                        <div className="absolute top-[4vh] right-[4vw] font-gothic text-[20vw] leading-none text-white/[0.06] mix-blend-overlay select-none pointer-events-none">
                            {project.id}
                        </div>

                        {/* Card Metadata Block — Bottom Left */}
                        <div
                            className={`card-meta-${index} absolute bottom-[8vh] left-[6vw] right-[6vw] md:left-[8vw] md:right-[40vw] pointer-events-none`}
                        >
                            <p
                                className="font-accent text-[10px] tracking-[0.3em] uppercase mb-3"
                                style={{ color: project.accent }}
                            >
                                {project.category}
                            </p>
                            <h2 className="font-display text-[10vw] md:text-[6vw] leading-[0.88] mb-6 text-white">
                                {project.title}
                            </h2>
                            <div className="flex items-center gap-6 font-body text-[11px] tracking-[0.15em] uppercase text-white/50">
                                <span>{project.client}</span>
                                <span className="w-12 h-[1px] bg-white/20 inline-block" />
                                <span>{project.year}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ════════════════════════════════════════════════════════ */}
            {/*  MOBILE — Vertical Scroll Cards                        */}
            {/* ════════════════════════════════════════════════════════ */}
            <div className="md:hidden flex flex-col gap-6 px-4 pt-20 pb-12">
                {PROJECTS.map((project) => (
                    <div
                        key={`mobile-${project.id}`}
                        className="crazy-card-mobile relative w-full rounded-lg overflow-hidden"
                        style={{ height: '70vw' }}
                        onMouseEnter={() => setCursorMode('view')}
                        onMouseLeave={() => setCursorMode('default')}
                    >
                        {/* Image */}
                        <img
                            src={project.src}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ opacity: 0.8, filter: 'brightness(0.85) contrast(1.05)' }}
                        />

                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        {/* Metadata */}
                        <div className="absolute bottom-5 left-5 right-5">
                            <p
                                className="font-accent text-[9px] tracking-[0.3em] uppercase mb-2"
                                style={{ color: project.accent }}
                            >
                                {project.category}
                            </p>
                            <h2 className="font-display text-[7vw] leading-[0.92] mb-3 text-white">
                                {project.title}
                            </h2>
                            <div className="flex items-center gap-4 font-body text-[10px] tracking-[0.12em] uppercase text-white/50">
                                <span>{project.client}</span>
                                <span className="w-8 h-[1px] bg-white/20 inline-block" />
                                <span>{project.year}</span>
                            </div>
                        </div>

                        {/* Ghost Number */}
                        <div className="absolute top-3 right-4 font-gothic text-[16vw] leading-none text-white/[0.06] select-none pointer-events-none">
                            {project.id}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Scroll Progress Bar — Bottom ── */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.06] z-50 pointer-events-none hidden md:block">
                <div
                    className="scroll-progress-fill h-full origin-left"
                    style={{ backgroundColor: 'var(--accent)', transform: 'scaleX(0.2)' }}
                />
            </div>
        </section>
    );
}
