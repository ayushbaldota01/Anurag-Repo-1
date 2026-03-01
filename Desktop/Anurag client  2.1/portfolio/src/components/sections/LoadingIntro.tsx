'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useAppStore } from '@/store/useAppStore';

export default function LoadingIntro() {
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const loadingWrapperRef = useRef<HTMLDivElement>(null);
    const { setLoading } = useAppStore();

    useEffect(() => {
        if (!containerRef.current || !counterRef.current || !loadingWrapperRef.current) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setLoading(false);
                gsap.set(containerRef.current, { display: 'none' });
            }
        });

        // 0-0.5s: Keep black screen
        tl.to({}, { duration: 0.5 });

        // 0.5-1.5s: Counter 0% -> 100%
        const counterObj = { val: 0 };
        tl.to(counterObj, {
            val: 100,
            duration: 1.0,
            ease: 'power4.inOut',
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.innerText = `${Math.round(counterObj.val)}%`;
                }
            }
        });

        // 1.5-2.0s: Screen wipes up
        tl.to(loadingWrapperRef.current, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.8,
            ease: 'power3.inOut'
        });

        return () => {
            tl.kill();
        };
    }, [setLoading]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[999] pointer-events-none flex"
        >
            <div
                ref={loadingWrapperRef}
                className="absolute inset-0 bg-text-primary flex flex-col items-center justify-center text-bg-primary"
                style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            >
                <div className="font-display text-2xl tracking-widest uppercase mb-8 opacity-50">CLOXX MEDIA</div>
                <div ref={counterRef} className="font-accent text-6xl md:text-8xl tabular-nums tracking-tighter">
                    0%
                </div>
            </div>
        </div>
    );
}
