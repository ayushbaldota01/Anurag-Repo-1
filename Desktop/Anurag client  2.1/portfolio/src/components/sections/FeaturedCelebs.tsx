'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

const CELEBS = [
    {
        id: 'c1',
        name: 'URVASHI RAUTELA',
        role: 'FEATURED MUSE',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
    },
    {
        id: 'c2',
        name: 'VARUN DHAWAN',
        role: 'EDITORIAL COVER',
        src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop',
    },
    {
        id: 'c3',
        name: 'TIGER SHROFF',
        role: 'ACTION CAMPAIGN',
        src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop',
    },
    {
        id: 'c4',
        name: 'KARTIK AARYAN',
        role: 'LIFESTYLE SHOOT',
        src: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1600&auto=format&fit=crop',
    },
    {
        id: 'c5',
        name: 'DISHA PATANI',
        role: 'BEAUTY PROFILE',
        src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=1600&auto=format&fit=crop',
    }
];

export default function FeaturedCelebs() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.celeb-card');

            // Set initial states
            gsap.set(cards, {
                y: (i) => i === 0 ? '0%' : '120%',
                scale: 1,
                opacity: (i) => i === 0 ? 1 : 0,
                transformOrigin: 'top center'
            });

            // Creates a timeline mapped to the overall section scroll
            // Pin the wrapper so it stays on screen while the 500vh container scrolls
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    pin: wrapperRef.current,
                    anticipatePin: 1
                }
            });

            // We loop through cards (skipping the first one as it's already there)
            cards.forEach((card, i) => {
                if (i === 0) return;

                // When Card i comes up, it pushes all previous cards (0 to i-1) back in space
                const previousCards = cards.slice(0, i);

                // Animation segment for the new card arriving
                tl.to(card, {
                    y: '0%',
                    opacity: 1,
                    ease: 'power2.out',
                    duration: 1
                }, i); // Use 'i' as an absolute timeline step

                // Animate all previous cards to stack behind
                tl.to(previousCards, {
                    scale: '-=0.04', // Each layer gets 4% smaller
                    y: '-=3%',      // Each layer shifts up slightly to peek over
                    filter: 'brightness(0.3)', // Darken older layers
                    ease: 'power2.out',
                    duration: 1
                }, i);
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#030303] text-white h-[500vh]">
            <div
                ref={wrapperRef}
                className="w-full h-screen flex flex-col items-center justify-center overflow-hidden relative"
            >
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                    <h2 className="text-[25vw] font-gothic tracking-tighter text-white/5 whitespace-nowrap">
                        ICONS
                    </h2>
                </div>

                <div className="relative w-full max-w-[90vw] md:max-w-[70vw] h-[75vh] md:h-[80vh] flex items-center justify-center perspective-[2000px]">
                    {CELEBS.map((celeb, i) => (
                        <div
                            key={celeb.id}
                            className={`celeb-card absolute w-full md:w-[65%] h-full top-0 md:top-auto rounded-[1rem] md:rounded-[2rem] overflow-hidden bg-black flex flex-col justify-end shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5 cursor-pointer`}
                            style={{ zIndex: i + 10 }}
                            onMouseEnter={() => setCursorMode('view')}
                            onMouseLeave={() => setCursorMode('default')}
                        >
                            <img
                                src={celeb.src}
                                alt={celeb.name}
                                className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
                            />

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                            <div className="relative z-10 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-none">
                                <div>
                                    <p className="text-[#D4AF37] font-body text-[10px] md:text-sm tracking-[0.3em] font-medium uppercase mb-2">
                                        {celeb.role}
                                    </p>
                                    <h3 className="font-gothic text-4xl md:text-7xl tracking-tight leading-none text-white">
                                        {celeb.name}
                                    </h3>
                                </div>
                                <div className="text-white/40 font-body text-sm font-light uppercase tracking-widest hidden md:block">
                                    0{i + 1} / 05
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
