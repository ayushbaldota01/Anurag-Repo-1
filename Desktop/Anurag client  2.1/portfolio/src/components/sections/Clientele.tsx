'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TextReveal from '@/components/ui/TextReveal';

const CLIENTS = [
    "GQ India", "Fashion Brands", "Restaurants", "Food Brands", "Digital Presence", "Creative Strategy"
];

export default function Clientele() {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!marqueeRef.current) return;

        // Infinite horizontal marquee scroll
        const tl = gsap.to(marqueeRef.current, {
            xPercent: -50,
            ease: "none",
            duration: 30, // 30s per complete cycle
            repeat: -1,
        });

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section ref={containerRef} className="bg-[#000000] text-white py-24 md:py-32 overflow-hidden border-t border-white/10">
            <div className="px-6 md:px-[6vw] mb-16">
                <div className="font-accent text-sm tracking-widest text-text-secondary mb-4">03</div>
                <TextReveal as="h2" text="Trusted By" className="font-display text-5xl md:text-7xl" />
            </div>

            <div className="relative flex overflow-x-hidden whitespace-nowrap mt-16 group">
                <div
                    ref={marqueeRef}
                    className="flex whitespace-nowrap group-hover:[animation-play-state:paused] pointer-events-auto items-center"
                >
                    {/* Double the list to make seamless loop */}
                    {[...CLIENTS, ...CLIENTS].map((client, i) => (
                        <div
                            key={`${client}-${i}`}
                            className="flex items-center px-8 md:px-16"
                        >
                            <span className="font-display text-4xl md:text-6xl uppercase opacity-40 hover:opacity-100 transition-opacity duration-300">
                                {client}
                            </span>
                            <div className="w-2 h-2 rounded-full bg-accent ml-16 md:ml-32 opacity-50" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
