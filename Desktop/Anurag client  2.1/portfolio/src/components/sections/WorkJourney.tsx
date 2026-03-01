'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
    { id: '01', title: 'Zendaya x Vogue', category: 'Editorial', client: 'Vogue Italia', year: '2024', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop', num: '01 / 04' },
    { id: '02', title: 'Met Gala 2024', category: 'Red Carpet', client: 'Vogue', year: '2024', src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=1600&auto=format&fit=crop', num: '02 / 04' },
    { id: '03', title: 'Gucci FW24', category: 'Campaigns', client: 'Gucci', year: '2024', src: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1600&auto=format&fit=crop', num: '03 / 04' },
];

const MILESTONES = [
    { year: '2012', title: 'First Camera', desc: 'The journey begins with a 35mm film body.' },
    { year: '2018', title: 'Vogue Breakthrough', desc: 'Cover shoot that shifted the paradigm.' },
    { year: '2022', title: 'Cannes Focus', desc: 'Exclusive access to the red carpet.' },
    { year: '2024', title: 'The Cinematic Archive', desc: '12 years of defining culture.' }
];

const CLIENTS = ["APPLE", "NIKE", "NBA", "GOOGLE", "GUCCI", "VOGUE", "VANITY FAIR", "SAINT LAURENT", "PRADA", "BEYONCÉ", "THE WEEKND"];

const STATS = [
    { val: 154, label: 'GLOBAL CAMPAIGNS', desc: 'Directed & shot' },
    { val: 28, label: 'MAGAZINE COVERS', desc: 'International editions' },
    { val: 12, label: 'YEARS IN FOCUS', desc: 'Perfecting the craft' }
];

export default function WorkJourney() {
    const containerRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {

            // PHASE 1: Hero Animations
            const heroTl = gsap.timeline();
            heroTl.from(".wj-hero-bg", { opacity: 0, duration: 1.5, ease: "power2.inOut" })
                .from(".wj-hero-3d-img", { y: 200, rotationX: 45, opacity: 0, duration: 2, ease: "power3.out" }, "-=1")
                .from(".wj-char", { y: 100, opacity: 0, rotationX: -90, stagger: 0.05, duration: 1.2, ease: "power4.out" }, "-=1.5")
                .from(".wj-hero-sub", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5");

            gsap.to(".wj-hero-3d-img", {
                y: -150, rotationY: 15,
                scrollTrigger: { trigger: ".wj-hero-section", start: "top top", end: "bottom top", scrub: 1 }
            });

            // PHASE 2: Timeline
            gsap.from(".wj-timeline-line", {
                scaleY: 0, transformOrigin: 'top center', ease: "none",
                scrollTrigger: { trigger: ".wj-timeline-section", start: "top center", end: "bottom center", scrub: 1 }
            });

            const nodes = gsap.utils.toArray<HTMLElement>(".wj-timeline-node");
            nodes.forEach((node) => {
                gsap.from(node.querySelector(".wj-node-dot"), {
                    scale: 0, opacity: 0, duration: 0.5, ease: "back.out(1.7)",
                    scrollTrigger: { trigger: node, start: "top 80%", toggleActions: "play none none reverse" }
                });
                gsap.from(node.querySelector(".wj-branch"), {
                    scaleX: 0, transformOrigin: "left center", duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: node, start: "top 70%", toggleActions: "play none none reverse" }
                });
            });

            // PHASE 3: Featured Projects
            const theaters = gsap.utils.toArray<HTMLElement>(".wj-project-theater");
            theaters.forEach((theater) => {
                ScrollTrigger.create({ trigger: theater, start: "top top", end: "+=300%", pin: true, scrub: 1 });

                const ptTl = gsap.timeline({ scrollTrigger: { trigger: theater, start: "top top", end: "+=300%", scrub: 1 } });
                ptTl.fromTo(theater.querySelector(".wj-project-image"), { scale: 1.2, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 1 })
                    .from(theater.querySelectorAll(".wj-title-line"), { y: 100, opacity: 0, stagger: 0.2, duration: 0.5 }, "-=0.5")
                    .from(theater.querySelector(".wj-meta-left"), { x: -50, opacity: 0, duration: 0.5 }, "-=0.3")
                    .from(theater.querySelector(".wj-meta-right"), { x: 50, opacity: 0, duration: 0.5 }, "-=0.5")
                    .from(theater.querySelector(".wj-quote"), { y: 30, opacity: 0, duration: 0.5 }, "-=0.3")
                    .to(theater.querySelector(".wj-project-inner"), { scale: 0.95, opacity: 0, duration: 0.5 }, "+=0.5");
            });

            // PHASE 4: Clientele Marquee
            const marqueeInner = document.querySelector(".wj-marquee-inner");
            if (marqueeInner) {
                gsap.to(marqueeInner, { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
            }

            // PHASE 5: Stats Counter
            const stats = gsap.utils.toArray<HTMLElement>(".wj-stat-num");
            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute("data-target") || '0');
                const obj = { val: 0 };
                ScrollTrigger.create({
                    trigger: stat, start: "top 80%",
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target, duration: 2.5, ease: "power2.out",
                            onUpdate: () => { stat.textContent = Math.floor(obj.val).toLocaleString(); },
                            onComplete: () => {
                                gsap.fromTo(stat, { textShadow: "0 0 0px rgba(196,167,125,0)" }, { textShadow: "0 0 40px rgba(196,167,125,0.5)", duration: 0.5, yoyo: true, repeat: 1 });
                            }
                        });
                    }
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Split text helper
    const splitChars = (text: string) => text.split('').map((c, i) => (
        <span key={i} className="wj-char inline-block" style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
    ));

    return (
        <div ref={containerRef as any} className="wj-container bg-[#0A0A0A] text-[#FFFFFF] w-full min-h-screen relative overflow-hidden"
            style={{ '--bg-primary': '#0A0A0A', '--bg-secondary': '#111111', '--bg-elevated': '#1A1A1A', '--accent': '#C4A77D' } as React.CSSProperties}>

            {/* NOISE OVERLAY */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-[9999] opacity-[0.03] opacity-30"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            {/* PHASE 1: HERO */}
            <section ref={heroRef} className="wj-hero-section relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
                <div className="wj-hero-bg absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A] z-0" />
                <div className="wj-hero-3d-img relative w-[40vw] h-[60vh] md:w-[25vw] md:h-[50vh] z-10 opacity-70 mb-10 overflow-hidden rounded shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <Image src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop" alt="Vintage Camera Dark" fill className="object-cover grayscale contrast-125" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(196,167,125,0.15)] mix-blend-overlay" />
                </div>

                <div className="relative z-20 text-center flex flex-col items-center -mt-32 uppercase cursor-default">
                    <h1 className="font-display text-[12vw] font-bold leading-[0.8] tracking-[-0.03em] flex flex-wrap justify-center overflow-hidden clip-text-container">
                        {splitChars("12 YEARS")}
                    </h1>
                    <h2 className="wj-hero-sub font-display text-[4vw] md:text-[2vw] font-bold mt-4 opacity-80 text-[#C4A77D]">
                        Of Capturing Icons
                    </h2>
                </div>
            </section>

            {/* PHASE 2: EVOLVING TIMELINE */}
            <section className="wj-timeline-section relative w-full py-[20vh] px-[5vw] md:px-[10vw]">
                <div className="relative w-full max-w-5xl mx-auto min-h-[150vh] flex flex-col">
                    {/* Center Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#333] to-[#C4A77D] origin-top wj-timeline-line -translate-x-1/2" />

                    {MILESTONES.map((m, i) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div key={i} className={`wj-timeline-node relative w-full flex mb-[20vh] ${isLeft ? 'md:justify-start' : 'md:justify-end'} pl-[60px] md:pl-0 items-center group`}>
                                {/* Dot */}
                                <div className="wj-node-dot absolute left-[20px] md:left-1/2 w-[12px] h-[12px] rounded-full bg-[#C4A77D] -translate-x-1/2 shadow-[0_0_20px_rgba(196,167,125,0.6)] z-10 cursor-pointer" />

                                {/* Branch - Desktop only */}
                                <div className={`wj-branch hidden md:block absolute top-[6px] h-[1px] bg-[#C4A77D]/30 w-[15%] ${isLeft ? 'left-[35%] origin-right' : 'right-[35%] origin-left'}`} />

                                {/* Card */}
                                <div className={`relative bg-[#1A1A1A] border border-white/5 p-8 rounded w-full md:w-[40%] transition-colors duration-500 hover:border-[#C4A77D]/40 hover:shadow-[0_0_40px_rgba(196,167,125,0.1)] group/card overflow-hidden`}
                                    onMouseEnter={() => setCursorMode('view')} onMouseLeave={() => setCursorMode('default')}>
                                    <div className="relative z-10 pointer-events-none">
                                        <div className="font-accent text-[#C4A77D] text-[14px] md:text-[20px] mb-2">{m.year}</div>
                                        <h3 className="font-display text-2xl md:text-3xl mb-4">{m.title}</h3>
                                        <p className="font-body text-[#888888] text-sm md:text-base leading-relaxed">{m.desc}</p>
                                    </div>
                                    <div className="absolute inset-0 z-0 opacity-0 group-hover/card:opacity-30 scale-90 group-hover/card:scale-100 transition-all duration-700 ease-out pointer-events-none">
                                        <Image src={PROJECTS[i % PROJECTS.length].src} alt="Milestone" fill className="object-cover grayscale mix-blend-overlay" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* PHASE 3: PROJECT THEATER */}
            {PROJECTS.map((p, i) => (
                <section key={i} className="wj-project-theater relative w-full h-screen overflow-hidden bg-[#0A0A0A]">
                    <div className="wj-project-inner w-full h-full relative">
                        {/* Background Image Parallax */}
                        <div className="absolute w-full h-full z-0 wj-project-image">
                            <Image src={p.src} alt={p.title} fill className="object-cover" />
                        </div>

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/30 z-10" />

                        {/* Content */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-[5vw]">
                            <div className="flex justify-between items-end w-full">
                                <div className="w-2/3">
                                    <h2 className="font-display text-[8vw] leading-[0.85] font-bold mix-blend-overlay opacity-90 text-white clip-text-container pb-2">
                                        <div className="wj-title-line uppercase">{p.title}</div>
                                    </h2>
                                </div>
                            </div>

                            {/* Metadata Floating */}
                            <div className="absolute top-[5vw] left-[5vw] font-accent text-[12px] uppercase tracking-[0.2em] wj-meta-left">
                                {p.num}
                            </div>
                            <div className="absolute top-[5vw] right-[5vw] font-accent text-[12px] uppercase tracking-[0.2em] wj-meta-right text-[#888]">
                                {p.year}
                            </div>
                            <div className="absolute bottom-[5vw] right-[5vw] font-accent text-[12px] uppercase tracking-[0.2em] wj-meta-right text-[#C4A77D]">
                                {p.category}
                            </div>
                            <div className="absolute top-[40vh] left-[5vw] md:left-[10vw] max-w-sm wj-quote">
                                <p className="font-display italic text-2xl md:text-3xl text-white/80 border-l px-6 border-[#C4A77D]">
                                    &quot;A cinematic eye that completely transformed our visual identity.&quot;
                                </p>
                                <p className="font-accent mt-4 text-[10px] tracking-widest text-[#888]">{p.client}</p>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* PHASE 4: CLIENTELE WALL */}
            <section className="relative w-full py-[15vh] bg-[#111111] overflow-hidden wj-marquee-container"
                onMouseEnter={() => gsap.to(".wj-marquee-inner", { timeScale: 0, duration: 0.5 })}
                onMouseLeave={() => gsap.to(".wj-marquee-inner", { timeScale: 1, duration: 0.5 })}>
                <div className="border-y border-white/5 py-12 flex items-center whitespace-nowrap overflow-hidden">
                    <div className="wj-marquee-inner flex font-display text-[6vw] font-bold uppercase text-white/[0.05] tracking-tight hover:[color:white] gap-[100px] cursor-pointer">
                        {[...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
                            <div key={i} className="group relative hover:text-white transition-colors duration-300 hover:drop-shadow-[0_0_20px_rgba(196,167,125,0.5)]">
                                {client} <span className="text-[#C4A77D] text-[3vw] align-middle mx-[50px]">—</span>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-[100px] h-[100px] rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 pointer-events-none z-50">
                                    <Image src={PROJECTS[i % PROJECTS.length].src} alt="Client Work" fill className="object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PHASE 5: IMPACT STATS */}
            <section className="relative w-full py-[20vh] bg-[#0A0A0A] flex flex-col md:flex-row justify-around px-8 gap-y-16">
                {STATS.map((s, i) => (
                    <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="wj-stat-num font-accent text-[12vw] md:text-[8vw] font-bold text-[#C4A77D] leading-none mb-4 tracking-tighter" data-target={s.val}>
                            0
                        </div>
                        <div className="font-body text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-2 text-white">
                            {s.label}
                        </div>
                        <div className="font-body text-[#444444] text-xs">
                            {s.desc}
                        </div>
                    </div>
                ))}
            </section>

        </div>
    );
}
