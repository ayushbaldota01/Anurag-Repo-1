'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { cn } from '@/lib/utils';

interface TextRevealProps {
    text: string;
    as?: React.ElementType;
    className?: string;
    delay?: number;
}

export default function TextReveal({ text, as: Component = 'p', className, delay = 0 }: TextRevealProps) {
    const textRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        // Split text into lines
        const split = new SplitType(textRef.current, { types: 'lines', lineClass: 'clip-text-container' });

        // Wrap the lines to ensure the container masks the transform
        split.lines?.forEach((line) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('clip-text-container');
            line.parentNode?.insertBefore(wrapper, line);
            wrapper.appendChild(line);
            line.style.transform = 'translateY(100%)';
        });

        const trigger = ScrollTrigger.create({
            trigger: textRef.current,
            start: "top 80%",
            onEnter: () => {
                gsap.to(split.lines, {
                    y: '0%',
                    duration: 1.2,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: delay,
                });
            },
        });

        return () => {
            trigger.kill();
            split.revert();
        };
    }, [delay, text]);

    return (
        <Component ref={textRef} className={cn("m-0", className)}>
            {text}
        </Component>
    );
}
