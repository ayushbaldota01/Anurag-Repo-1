'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorLabelRef = useRef<HTMLDivElement>(null);
    const { cursorMode } = useAppStore();

    useEffect(() => {
        const dot = cursorRef.current;
        const pill = cursorLabelRef.current;
        if (!dot || !pill) return;

        // Set initial alignment to perfectly center
        gsap.set([dot, pill], { xPercent: -50, yPercent: -50 });

        const xToDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
        const yToDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });

        const xToPill = gsap.quickTo(pill, 'x', { duration: 0.25, ease: 'power3' });
        const yToPill = gsap.quickTo(pill, 'y', { duration: 0.25, ease: 'power3' });

        const onMouseMove = (e: MouseEvent) => {
            xToDot(e.clientX);
            yToDot(e.clientY);
            xToPill(e.clientX);
            yToPill(e.clientY);
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    useEffect(() => {
        const dot = cursorRef.current;
        const pill = cursorLabelRef.current;
        if (!dot || !pill) return;

        if (cursorMode === 'view') {
            gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });
            gsap.to(pill, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' });
        } else if (cursorMode === 'link') {
            gsap.to(dot, { scale: 3.33, opacity: 1, duration: 0.3, ease: 'power3.out' });
            gsap.to(pill, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });
        } else {
            gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });
            gsap.to(pill, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });
        }
    }, [cursorMode]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            <div
                ref={cursorRef}
                className="absolute top-0 left-0 w-[12px] h-[12px] bg-white rounded-full mix-blend-difference will-change-transform"
            />
            <div
                ref={cursorLabelRef}
                className="absolute top-0 left-0 bg-[#5d61f5] text-white flex items-center justify-center gap-2 px-4 py-2 rounded-full will-change-transform origin-center shadow-lg"
                style={{ transform: 'scale(0)', opacity: 0, paddingRight: '1rem', paddingLeft: '0.8rem' }}
            >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="font-accent text-xs font-bold tracking-widest uppercase mt-[2px] whitespace-nowrap">View Case</span>
            </div>
        </div>
    );
}
