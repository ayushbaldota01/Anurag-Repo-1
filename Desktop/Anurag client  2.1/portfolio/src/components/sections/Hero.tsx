'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import CameraScene from '@/components/ui/CameraScene';

export default function Hero() {
    const { isLoading } = useAppStore();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || !heroRef.current) return;
        const tl = gsap.timeline();

        // 1. Entrance animation
        tl.from(".hero-text-char", {
            y: 150,
            opacity: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
        });

        tl.from(".hero-subtext", { y: -20, opacity: 0, duration: 1, ease: 'power3.out' }, "-=0.8");
        tl.from(".nav-item", { y: -20, opacity: 0, duration: 0.8, stagger: 0.05, ease: 'power2.out' }, "-=1");

    }, [isLoading]);

    const title = "CAPTURING LIFE".split('');

    return (
        <section ref={heroRef} className="relative w-full h-[100svh] overflow-hidden bg-[#000000] text-text-primary flex flex-col items-center justify-center">

            {/* 3D DSLR Camera Background */}
            <CameraScene />

            {/* Front Overlay Gradient to transition edges and maintain text readability */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_150%)] opacity-90 mix-blend-multiply" />

            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-[4vw]">

                {/* Modern Studio Navbar structure kept minimal */}
                <header className="w-full flex justify-between items-center text-[10px] md:text-[11px] font-body tracking-[0.15em] uppercase font-bold text-white">
                    {/* Top Left: Client Name */}
                    <div className="nav-item cursor-pointer text-white/50 tracking-widest pointer-events-auto hover:text-white transition-colors">
                        CLOXX MEDIA
                    </div>

                    <div className="hidden md:flex gap-[4vw] pointer-events-auto">
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors">Selected Work</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors">About</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors">Boanyard</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors">Let&apos;s Chat</div>
                    </div>

                    <div className="md:hidden nav-item cursor-pointer pointer-events-auto">Menu</div>
                </header>

                {/* Bottom Right: Scroll to Explore */}
                <div className="nav-item self-end text-white/50 text-[10px] md:text-[12px] font-accent uppercase tracking-[0.2em] font-medium flex items-center gap-4 mb-8 md:mb-0">
                    <span>Scroll to Explore</span>
                    <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden hidden md:block">
                        <div className="absolute top-0 left-0 w-full h-full bg-white animate-scroll-line" />
                    </div>
                </div>
            </div>

            {/* Central Typography: Large, Blend Modes */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full pointer-events-none mix-blend-overlay md:mix-blend-normal">
                {/* The mix-blend-overlay creates transparency seeing the model behind. For maximum impact: text-white/80 */}
                <h1 className="flex flex-wrap justify-center text-[15vw] md:text-[12vw] leading-none mb-0 z-20 font-gothic tracking-tighter mix-blend-overlay text-white opacity-90 px-4 text-center">
                    {title.map((char, index) => (
                        <span key={index} className="hero-text-char inline-block" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)', whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                            {char}
                        </span>
                    ))}
                </h1>

                <p className="hero-subtext font-body text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold text-white/70 mt-[4vw] md:mt-[-1vw]">
                    (PROFESSIONAL PHOTOGRAPHER)
                </p>
            </div>
        </section>
    );
}
