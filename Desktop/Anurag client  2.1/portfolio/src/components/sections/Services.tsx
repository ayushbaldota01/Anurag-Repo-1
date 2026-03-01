'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';
import TextReveal from '@/components/ui/TextReveal';
import { cn } from '@/lib/utils';

const SERVICES = [
    { id: '01', title: 'Brand Campaigns', desc: 'Partnering with fashion and food brands to create high quality campaigns and scalable promotional visuals.', image: 'https://images.unsplash.com/photo-1512412046876-f386342eddb3?q=80&w=1000&auto=format&fit=crop' },
    { id: '02', title: 'Celebrity Sessions', desc: 'Collaborating with celebrities & influencers for premium video and photo shoots.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop' },
    { id: '03', title: 'Event Coverage', desc: 'Coverage for brand launches, exhibitions, and premium award functions.', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop' },
    { id: '04', title: 'Lifestyle & Travel', desc: 'Creating engaging lifestyle and travel content specifically optimized for social platforms.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop' },
    { id: '05', title: 'BTS & Reels', desc: 'Dynamic behind-the-scenes videos for fashion shows and creative short-form marketing reels.', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop' },
];

export default function Services() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const imagePreviewRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!containerRef.current || !imagePreviewRef.current) return;

        // Fixed image preview follower (similar to custom cursor but larger)
        const xTo = gsap.quickTo(imagePreviewRef.current, 'left', { duration: 0.8, ease: 'power3' });
        const yTo = gsap.quickTo(imagePreviewRef.current, 'top', { duration: 0.8, ease: 'power3' });

        const handleMouseMove = (e: MouseEvent) => {
            // Offset by half the width/height of the preview (which is roughly 300x400)
            xTo(e.clientX - 150);
            yTo(e.clientY - 200);
        };

        window.addEventListener('mousemove', handleMouseMove);

        // ScrollTrigger line drawing animation
        const lines = gsap.utils.toArray('.service-line') as HTMLElement[];
        lines.forEach((line) => {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 90%',
                    }
                }
            );
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full bg-[#000000] text-white py-24 md:py-[10vw]">
            <div className="px-6 md:px-[6vw] mb-16 md:mb-24 flex flex-col md:flex-row justify-between md:items-end">
                <div>
                    <div className="font-accent text-sm tracking-widest text-white/40 mb-4">03</div>
                    <TextReveal as="h2" text="Expertise" className="font-display text-5xl md:text-7xl" />
                </div>
                <p className="font-body text-text-secondary max-w-sm mt-8 md:mt-0 text-balance leading-relaxed">
                    From concept to execution, bringing an unyielding commitment to excellence and authentic storytelling.
                </p>
            </div>

            <div className="px-6 md:px-[6vw]">
                {SERVICES.map((service, index) => (
                    <div
                        key={service.id}
                        className="relative group border-t border-text-primary/20 service-container"
                        onMouseEnter={() => {
                            setHoveredIndex(index);
                            setCursorMode('view');
                        }}
                        onMouseLeave={() => {
                            setHoveredIndex(null);
                            setCursorMode('default');
                        }}
                    >
                        {/* The animated line across the top */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-text-primary origin-left scale-x-0 service-line" />

                        <div className="py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between cursor-none transition-colors duration-500 group-hover:bg-text-primary/5">
                            <div className="flex items-center gap-8 md:gap-16">
                                <span className="font-accent text-lg md:text-xl text-text-secondary opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                    {service.id}
                                </span>
                                <h3 className="font-display text-3xl md:text-5xl group-hover:translate-x-4 transition-transform duration-500 ease-out">{service.title}</h3>
                            </div>

                            <div
                                className={cn(
                                    "mt-4 md:mt-0 max-w-sm md:text-right font-body text-text-secondary transition-all duration-500 grid overflow-hidden",
                                    hoveredIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 md:opacity-100 md:grid-rows-[1fr]"
                                )}
                            >
                                <div className="min-h-0">
                                    <p className="md:translate-x-[-16px] group-hover:translate-x-0 transition-transform duration-500">{service.desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="w-full h-[1px] bg-text-primary origin-left scale-x-0 service-line" />
            </div>

            {/* Fixed Image Preview container for desktop */}
            <div
                ref={imagePreviewRef}
                className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 overflow-visible hidden md:block"
                style={{
                    opacity: hoveredIndex !== null ? 1 : 0,
                    transition: 'opacity 0.4s ease-out',
                }}
            >
                {SERVICES.map((service, index) => {
                    const isActive = hoveredIndex === index;
                    return (
                        <div
                            key={`img-${service.id}`}
                            className="absolute inset-0"
                            style={{
                                opacity: isActive ? 1 : 0,
                                zIndex: isActive ? 10 : 0,
                                visibility: isActive ? 'visible' : 'hidden',
                                transition: 'opacity 0.15s linear'
                            }}
                        >
                            <div
                                className="absolute inset-0 z-10 overflow-hidden shadow-2xl rounded-sm"
                                style={{
                                    clipPath: isActive ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
                                    transition: 'clip-path 0.7s cubic-bezier(0.19, 1, 0.22, 1)',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                }}
                            >
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover"
                                    sizes="300px"
                                    style={{
                                        transform: isActive ? 'scale(1)' : 'scale(1.15)',
                                        transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
