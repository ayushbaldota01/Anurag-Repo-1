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
        const tl = gsap.timeline({ delay: 0.3 });

        // 1. Title characters cascade in
        tl.from(".hero-text-char", {
            y: 120,
            opacity: 0,
            rotationX: 90,
            duration: 1.2,
            stagger: 0.06,
            ease: 'power4.out',
            transformOrigin: 'bottom center',
        });

        // 2. Divider line expands
        tl.from(".hero-divider", {
            scaleX: 0,
            duration: 1.2,
            ease: 'power3.inOut',
        }, "-=0.6");

        // 3. Subtext fades up
        tl.from(".hero-subtext", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, "-=0.8");

        // 4. Nav items stagger in
        tl.from(".nav-item", {
            y: -20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power2.out'
        }, "-=1");

        // 5. Side elements slide in
        tl.from(".hero-side-element", {
            opacity: 0,
            x: -20,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
        }, "-=0.6");

    }, [isLoading]);

    const title = "CAPTURING LIFE".split('');

    return (
        <section
            ref={heroRef}
            className="relative w-full h-[100svh] overflow-hidden bg-[#030303] text-white flex flex-col items-center justify-center"
        >
            {/* 3D DSLR Camera Background */}
            <CameraScene />

            {/* Vignette overlay for depth and text readability */}
            <div className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 0%, rgba(3,3,3,0.4) 50%, rgba(3,3,3,0.95) 100%)',
                }}
            />

            {/* Top edge fade for navbar contrast */}
            <div className="absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none bg-gradient-to-b from-[#030303]/60 to-transparent" />

            {/* Content Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-[4vw]">

                {/* Navbar */}
                <header className="w-full flex justify-between items-center text-[10px] md:text-[11px] font-body tracking-[0.15em] uppercase font-bold text-white">
                    <div className="nav-item cursor-pointer text-white/50 tracking-widest pointer-events-auto hover:text-white transition-colors duration-300">
                        CLOXX MEDIA
                    </div>

                    <div className="hidden md:flex gap-[4vw] pointer-events-auto">
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors duration-300">Selected Work</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors duration-300">About</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors duration-300">Services</div>
                        <div className="nav-item cursor-pointer hover:text-white/50 transition-colors duration-300">Let&apos;s Chat</div>
                    </div>

                    <div className="md:hidden nav-item cursor-pointer pointer-events-auto">Menu</div>
                </header>

                {/* Bottom Row */}
                <div className="flex justify-between items-end">
                    {/* Bottom Left: Year / Location */}
                    <div className="hero-side-element flex flex-col gap-1 text-[9px] md:text-[10px] font-accent tracking-[0.2em] uppercase text-white/30">
                        <span>© 2024</span>
                        <span>MUMBAI, IN</span>
                    </div>

                    {/* Bottom Right: Scroll Indicator */}
                    <div className="nav-item self-end text-white/40 text-[10px] md:text-[11px] font-accent uppercase tracking-[0.2em] font-medium flex items-center gap-4 mb-8 md:mb-0">
                        <span>Scroll to Explore</span>
                        <div className="w-[1px] h-12 bg-white/15 relative overflow-hidden hidden md:block">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/60 animate-scroll-line" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ══ Central Typography ══ */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center w-full pointer-events-none">

                {/* Main Title */}
                <h1 className="flex flex-wrap justify-center text-[14vw] md:text-[11vw] leading-[0.85] mb-0 z-20 font-gothic tracking-tight text-white px-4 text-center"
                    style={{ mixBlendMode: 'difference' }}
                >
                    {title.map((char, index) => (
                        <span
                            key={index}
                            className="hero-text-char inline-block"
                            style={{
                                whiteSpace: char === ' ' ? 'pre' : 'normal',
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </h1>

                {/* Gold divider line */}
                <div
                    className="hero-divider w-[60px] h-[1px] mt-6 mb-4 origin-center"
                    style={{ backgroundColor: 'var(--accent)' }}
                />

                {/* Subtitle */}
                <p className="hero-subtext font-accent text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-medium text-white/50">
                    Professional Photographer & Filmmaker
                </p>
            </div>
        </section>
    );
}
