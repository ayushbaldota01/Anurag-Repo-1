'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

const CELEBS = [
    { name: "Virat Kohli", img: "https://images.unsplash.com/photo-1583391265882-99d6fb350711?q=80&w=1600&auto=format&fit=crop" },
    { name: "Deepika Padukone", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=1600&auto=format&fit=crop" },
    { name: "Shah Rukh Khan", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop" },
    { name: "Priyanka Chopra", img: "https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1600&auto=format&fit=crop" },
    { name: "Ranveer Singh", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop" },
];

export default function CelebShowcase() {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const ctx = gsap.context(() => {
            gsap.fromTo('.celeb-item',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 70%',
                    }
                }
            );
        }, container);

        let animationFrameId: number;
        // Native mouse tracking to update CSS variables for the performant lens hook
        const handleMouseMove = (e: MouseEvent) => {
            animationFrameId = requestAnimationFrame(() => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                container.style.setProperty('--mouse-x', `${x}px`);
                container.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            ctx.revert();
        };
    }, []);

    // Mobile fallback slider sequence
    const [mobileIdx, setMobileIdx] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);

        const interval = setInterval(() => {
            setMobileIdx(prev => (prev + 1) % CELEBS.length);
        }, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-screen bg-[#030303] text-white flex flex-col justify-center overflow-hidden select-none z-30 md:-mt-[30vh] shadow-[0_-50px_100px_rgba(0,0,0,0.9)]"
        >

            {/* Background Image Layers */}
            <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700">
                {CELEBS.map((celeb, i) => {
                    const isActive = isMobile ? mobileIdx === i : hoveredIdx === i;

                    return (
                        <div
                            key={i}
                            className={`absolute inset-0 transition-opacity duration-700 ease-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {/* Layer 1: Desaturated Background */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.8] opacity-30 md:opacity-40"
                                style={{ backgroundImage: `url(${celeb.img})` }}
                            />

                            {/* Layer 2: Colored Lens Mask (Desktop Only) */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
                                style={{
                                    backgroundImage: `url(${celeb.img})`,
                                    clipPath: 'circle(180px at var(--mouse-x, 50%) var(--mouse-y, 50%))',
                                    WebkitClipPath: 'circle(180px at var(--mouse-x, 50%) var(--mouse-y, 50%))',
                                    filter: 'brightness(1.1) contrast(1.1)'
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* List Content */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 md:px-0">
                {CELEBS.map((celeb, i) => (
                    <div
                        key={i}
                        className="w-full max-w-6xl border-b border-white/10 last:border-b-0 group"
                        onMouseEnter={() => {
                            setHoveredIdx(i);
                            setCursorMode('hidden'); // Hide default cursor so it doesn't conflict with our lens ring
                        }}
                        onMouseLeave={() => {
                            setHoveredIdx(null);
                            setCursorMode('default');
                        }}
                    >
                        <div className="celeb-item py-8 md:py-10 cursor-none w-full flex items-center justify-center overflow-hidden">
                            <h2 className="text-5xl md:text-[8vw] font-display font-light uppercase tracking-tight text-white/40 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:text-white md:group-hover:translate-x-[40px] mix-blend-difference whitespace-nowrap">
                                {celeb.name}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ghost Ring for the Lens Boundary */}
            <div
                className="absolute top-0 left-0 w-[360px] h-[360px] border border-white/20 rounded-full pointer-events-none hidden md:block z-50 transition-opacity duration-[400ms]"
                style={{
                    transform: 'translate(calc(var(--mouse-x) - 180px), calc(var(--mouse-y) - 180px))',
                    opacity: hoveredIdx !== null ? 1 : 0
                }}
            />
        </section>
    );
}
