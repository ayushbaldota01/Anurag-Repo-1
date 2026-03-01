'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import TextReveal from '@/components/ui/TextReveal';
import MagneticButton from '@/components/ui/MagneticButton';
import { useAppStore } from '@/store/useAppStore';

const PRESS = [
    { text: "A masterful visual artist capturing the perfect moment.", source: "GQ India" },
    { text: "Brings immense creativity and scale to every project.", source: "Urvashi Rautela Team" },
    { text: "The definitive choice for high-quality lifestyle content.", source: "Leading Brands" }
];

export default function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    const footerBgRef = useRef<HTMLDivElement>(null);
    const { setCursorMode } = useAppStore();

    useEffect(() => {
        if (!containerRef.current || !footerBgRef.current) return;

        // Color transition on scroll into view
        gsap.fromTo(
            footerBgRef.current,
            { opacity: 0 },
            {
                opacity: 1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'top 30%',
                    scrub: true,
                }
            }
        );

    }, []);

    return (
        <footer ref={containerRef} className="relative w-full min-h-screen bg-[#000000] text-white overflow-hidden flex flex-col pt-32">
            {/* Background that fades in to create color transition */}
            <div ref={footerBgRef} className="absolute inset-0 bg-[#0A0A0A] z-0 h-[120%]" />

            <div className="relative z-10 flex-grow px-6 md:px-[6vw] flex flex-col justify-between h-full">

                {/* Press / Quotes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-b border-white/20 pb-24">
                    <div className="col-span-1 md:col-span-3 mb-8">
                        <div className="font-accent text-sm tracking-widest text-accent mb-4">04</div>
                        <TextReveal as="h2" text="Words" className="font-display text-4xl md:text-5xl" />
                    </div>

                    {PRESS.map((item, i) => (
                        <div key={i} className="flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
                            <p className="font-display text-2xl md:text-3xl leading-snug mb-8">&quot;{item.text}&quot;</p>
                            <span className="font-accent text-xs tracking-widest uppercase">— {item.source}</span>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
                    <TextReveal
                        as="h2"
                        text="Let's Create Together"
                        className="font-display text-5xl md:text-[8vw] leading-none mb-12"
                    />

                    <MagneticButton>
                        <a
                            href="mailto:cloxxmedia@gmail.com"
                            className="inline-block"
                            onMouseEnter={() => setCursorMode('link')}
                            onMouseLeave={() => setCursorMode('default')}
                        >
                            <div className="group relative font-accent text-lg md:text-2xl tracking-widest uppercase">
                                cloxxmedia@gmail.com
                                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-accent origin-right transform scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
                                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-white origin-left transform scale-x-0 transition-transform duration-500 delay-100 group-hover:scale-x-100" />
                            </div>
                        </a>
                    </MagneticButton>
                </div>

                {/* True Footer Footer */}
                <div className="mt-auto py-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-accent tracking-widest uppercase opacity-60">
                    <div className="flex gap-8 mb-4 md:mb-0">
                        <a href="https://www.cloxxmedia.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors" onMouseEnter={() => setCursorMode('link')} onMouseLeave={() => setCursorMode('default')}>Website</a>
                        <a href="#" className="hover:text-accent transition-colors" onMouseEnter={() => setCursorMode('link')} onMouseLeave={() => setCursorMode('default')}>Instagram</a>
                    </div>

                    <div className="text-center md:text-right">
                        Direct Inquiries: <br className="md:hidden" />+91 9867467671 | +91 7219044171
                    </div>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="mt-8 md:mt-0 hover:text-accent transition-colors"
                        onMouseEnter={() => setCursorMode('link')}
                        onMouseLeave={() => setCursorMode('default')}
                    >
                        Back to Top ↑
                    </button>
                </div>
            </div>
        </footer>
    );
}
