'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    priority?: boolean;
}

export default function ParallaxImage({ src, alt, className, imageClassName, priority = false }: ParallaxImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!containerRef.current || !imageRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Translate from -15% to 15% to create parallax depth
        tl.fromTo(
            imageRef.current,
            { yPercent: -15 },
            { yPercent: 15, ease: 'none' }
        );

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
            <Image
                ref={imageRef}
                src={src}
                alt={alt}
                fill
                className={cn("object-cover scale-[1.2] will-change-transform", imageClassName)}
                priority={priority}
            />
        </div>
    );
}
