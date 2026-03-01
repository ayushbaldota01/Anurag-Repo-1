'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '@/store/useAppStore';

gsap.registerPlugin(ScrollTrigger);

/* ─── PROJECT DATA & DISPERSION TARGETS ─── */
const PROJECTS = [
    {
        id: '01',
        title: 'Urvashi Rautela',
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
        targetX: '-38vw', targetY: '-30vh',
        scale: 1.1, rotation: -4, aspectRatio: 'aspect-[3/4]', speed: 1.2
    },
    {
        id: '02',
        title: 'Varun Dhawan',
        src: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop',
        targetX: '36vw', targetY: '-32vh',
        scale: 1.2, rotation: 5, aspectRatio: 'aspect-square', speed: 1.4
    },
    {
        id: '03',
        title: 'Tiger Shroff',
        src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600&auto=format&fit=crop',
        targetX: '-42vw', targetY: '25vh',
        scale: 0.9, rotation: 3, aspectRatio: 'aspect-[4/5]', speed: 1.1
    },
    {
        id: '04',
        title: 'Celebrity Feature',
        src: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1600&auto=format&fit=crop',
        targetX: '38vw', targetY: '30vh',
        scale: 1.05, rotation: -3, aspectRatio: 'aspect-[3/4]', speed: 1.3
    },
    {
        id: '05',
        title: 'Artist Portrait',
        src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cbb41?q=80&w=1600&auto=format&fit=crop',
        targetX: '0vw', targetY: '-42vh',
        scale: 0.85, rotation: 2, aspectRatio: 'aspect-video', speed: 1.5
    },
    {
        id: '06',
        title: 'Editorial Shoot',
        src: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop',
        targetX: '0vw', targetY: '42vh',
        scale: 1.15, rotation: -2, aspectRatio: 'aspect-[3/4]', speed: 1.2
    },
    {
        id: '07',
        title: 'Red Carpet',
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600&auto=format&fit=crop',
        targetX: '-18vw', targetY: '10vh',
        scale: 1.3, rotation: -5, aspectRatio: 'aspect-square', speed: 1.6
    },
    {
        id: '08',
        title: 'Fashion Week',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
        targetX: '22vw', targetY: '5vh',
        scale: 0.95, rotation: 4, aspectRatio: 'aspect-[4/5]', speed: 1.0
    }
];

export default function SelectedWorks() {
    const sectionRef = useRef<HTMLElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // DESKTOP: Placed explosion animation
            mm.add('(min-width: 768px)', () => {
                const images = gsap.utils.toArray<HTMLElement>('.explosion-image-desktop');
                if (images.length === 0) return;

                // 1. Initial State:
                gsap.set(images, {
                    x: 0,
                    y: 0,
                    scale: 0,
                    rotationZ: 0,
                    opacity: 0,
                });

                // 2. The scroll timeline attached to the container
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%', // Trigger even earlier
                        end: 'bottom bottom',
                        scrub: 1, // Smoother follow
                    }
                });

                // 3. The Explosion Sequence
                // Instantly pop into existence scaling up
                tl.to(images, {
                    opacity: 1,
                    scale: (i) => PROJECTS[i].scale,
                    duration: 0.3,
                    ease: 'power4.out',
                    stagger: 0.05
                }, 0);

                // Start throwing outwards heavily early in the scrub
                images.forEach((img, i) => {
                    const data = PROJECTS[i];

                    gsap.set(img, { zIndex: Math.floor(Math.random() * 10) + 10 });

                    // The outward translation
                    tl.to(img, {
                        x: data.targetX,
                        y: data.targetY,
                        rotationZ: data.rotation,
                        duration: 1.2 * data.speed,
                        ease: 'power2.out',
                    }, 0.1);

                    // The endless parallax floating
                    tl.to(img, {
                        y: `+=${parseFloat(data.targetY) > 0 ? '15vh' : '-15vh'}`,
                        x: `+=${parseFloat(data.targetX) > 0 ? '5vw' : '-5vw'}`,
                        rotationZ: `+=${data.rotation * -0.5}`,
                        duration: 1.5,
                        ease: 'none',
                    }, 1);

                    // Final step: Fade out as we approach the next section
                    tl.to(img, {
                        opacity: 0,
                        scale: 0.5,
                        duration: 0.5,
                        ease: 'power2.in',
                    }, 1.5);
                });

            });

            // MOBILE: Simple grid/stack
            mm.add('(max-width: 767px)', () => {
                // Remove the absolute center positioning and just show them natively
                const images = gsap.utils.toArray<HTMLElement>('.explosion-image-mobile');
                gsap.set(images, { clearProps: 'all' });

                // Simple fade up on scroll
                images.forEach((img) => {
                    gsap.from(img, {
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse',
                        },
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    });
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#030303] text-white overflow-hidden md:h-[200vh] h-auto z-10"
        >
            {/* The Sticky Wrapper */}
            <div className="md:sticky md:top-0 md:h-[100svh] w-full flex flex-col md:overflow-hidden items-center justify-center py-20 md:py-0">

                {/* Layer 1: The Massive Center Text (z-50) */}
                <div className="z-50 pointer-events-none mix-blend-difference flex flex-col items-center">
                    <h1 className="text-[15vw] md:text-[12vw] leading-none mb-0 font-gothic tracking-tighter text-white">
                        THE ARCHIVE
                    </h1>
                    <p className="font-body text-[12px] uppercase tracking-[0.3em] font-medium text-white/50 mt-2">
                        SELECTED WORK ({PROJECTS.length})
                    </p>
                </div>

                {/* Layer 2: The Exploding Images container */}
                <div className="w-full absolute inset-0 z-40 pointer-events-none hidden md:block">
                    {PROJECTS.map((project, idx) => (
                        <div
                            key={project.id}
                            className={`explosion-image-desktop absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25vw] ${project.aspectRatio} origin-center will-change-transform pointer-events-auto cursor-pointer p-1`}
                            onMouseEnter={() => setCursorMode('view')}
                            onMouseLeave={() => setCursorMode('default')}
                        >
                            {/* Inner wrapper for image to handle overflow and subtle zooming */}
                            <div className="w-full h-full relative overflow-hidden bg-[#111]">
                                <img
                                    src={project.src}
                                    alt={project.title}
                                    className="w-full h-full object-cover object-center pointer-events-none grayscale-[0.3] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                    loading={idx < 4 ? "eager" : "lazy"}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Layer 2 (Mobile Fallback Grid) */}
                <div className="w-full md:hidden flex flex-col gap-8 px-4 mt-12 z-40">
                    {PROJECTS.map((project, idx) => (
                        <div
                            key={`mob-${project.id}`}
                            className={`explosion-image-mobile relative w-full ${project.aspectRatio} overflow-hidden bg-[#111]`}
                        >
                            <img
                                src={project.src}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                loading={idx < 2 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
