'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);
    const rafCallbackRef = useRef<((time: number) => void) | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', ScrollTrigger.update);

        // Store the actual function reference so we can remove it properly
        const rafCallback = (time: number) => {
            lenis.raf(time * 1000);
        };
        rafCallbackRef.current = rafCallback;

        gsap.ticker.add(rafCallback);
        gsap.ticker.lagSmoothing(0);

        // Fix: Force GSAP to recalculate positions on load/resize to prevent broken reloads
        const refreshTriggers = () => ScrollTrigger.refresh();
        window.addEventListener('resize', refreshTriggers);

        // Wait a tick for initial render to settle
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => {
            window.removeEventListener('resize', refreshTriggers);
            if (rafCallbackRef.current) {
                gsap.ticker.remove(rafCallbackRef.current);
            }
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
