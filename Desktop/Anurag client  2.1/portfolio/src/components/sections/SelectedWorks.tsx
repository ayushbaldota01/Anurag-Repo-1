'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
    { id: '01', title: 'Urvashi Rautela', category: 'Creative Strategy', client: 'Digital Presence', year: '2024', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop', color: 'from-[#330000] to-[#0a0000]' },
    { id: '02', title: 'Varun Dhawan', category: 'Interviews & Events', client: 'GQ India', year: '2023', src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop', color: 'from-[#001a33] to-[#00050a]' },
    { id: '03', title: 'Tiger Shroff', category: 'Interviews & Events', client: 'GQ India', year: '2024', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', color: 'from-[#333300] to-[#0a0a00]' },
    { id: '04', title: 'Celebrity Feature', category: 'Premium Editorial', client: 'Fashion Brand', year: '2024', src: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=800&auto=format&fit=crop', color: 'from-[#1a0033] to-[#05000a]' },
    { id: '05', title: 'Artist Portrait', category: 'Exclusive Session', client: 'Private Commission', year: '2024', src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=800&auto=format&fit=crop', color: 'from-[#00331a] to-[#000a05]' },
];

export default function SelectedWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.crazy-card');
            if (cards.length === 0) return;

            // Set initial off-screen states for cards 2 through 5 (index 1 to 4)
            gsap.set(cards.slice(1), {
                y: "150vh",
                rotationZ: (i) => i % 2 === 0 ? 8 : -8,
                scale: 0.85,
                opacity: 0
            });

            // Master timeline hooked to scroll progress over the height of (total cards * 100vh)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${cards.length * 100}%`,
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    anticipatePin: 1,
                }
            });

            // Sequence each card into the timeline
            cards.forEach((card, i) => {
                if (i === 0) return; // First card is already resting at z=0

                // Bring current card IN
                tl.to(card, {
                    y: 0,
                    rotationZ: i % 2 === 0 ? 2 : -2,
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, i); // Absolute timing based on index 'i' creates a perfect sequential stagger

                // Push all previously stacked cards BACK
                tl.to(cards.slice(0, i), {
                    scale: "-=0.04",
                    y: "-=40",
                    opacity: "-=0.15",
                    duration: 1,
                    ease: "none"
                }, i);
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="w-full h-screen bg-[#000000] text-white overflow-hidden relative flex items-center justify-center">

            <div className="absolute top-12 left-6 md:left-[4vw] z-50 text-[10px] md:text-[11px] font-body tracking-[0.1em] uppercase font-bold text-white/80">
                <span className="opacity-50 mr-4">(SELECTED WORKS)</span>
                THE ARCHIVE
            </div>

            <div className="absolute top-12 right-6 md:right-[4vw] z-50 text-[10px] md:text-[11px] font-body tracking-[0.1em] uppercase font-bold text-white/80">
                SCROLL TO IMMERSE
            </div>

            <div ref={wrapperRef} className="relative w-[85vw] h-[65vh] md:w-[60vw] md:h-[70vh] perspective-[1200px]">
                {PROJECTS.map((project, index) => (
                    <div
                        key={project.id}
                        className={`crazy-card absolute inset-0 rounded-lg shadow-2xl overflow-hidden origin-bottom will-change-transform bg-[#0a0a0a] border border-white/5`}
                        style={{ zIndex: index + 10 }}
                        onMouseEnter={() => setCursorMode('view')}
                        onMouseLeave={() => setCursorMode('default')}
                    >
                        {/* 
                            Used native img tag instead of Next.js Image component here to completely 
                            bypass any potential next.config.js remotePatterns breakages for the client viewing. 
                        */}
                        <img
                            src={project.src}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
                            <h2 className="font-display text-[8vw] md:text-[5vw] leading-none mb-2 text-white drop-shadow-md">
                                {project.title}
                            </h2>
                            <div className="flex gap-4 font-accent text-[10px] md:text-[12px] tracking-[0.2em] uppercase text-accent drop-shadow-md">
                                <span>{project.category}</span>
                                <span>/</span>
                                <span className="text-white/70">{project.client}</span>
                                <span>/</span>
                                <span className="text-white/50">{project.year}</span>
                            </div>
                        </div>

                        <div className="absolute top-4 right-8 font-gothic text-[12vw] leading-none text-white/30 mix-blend-overlay font-bold">
                            {project.id}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
