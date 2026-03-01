'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ParallaxImage from '@/components/ui/ParallaxImage';
import TextReveal from '@/components/ui/TextReveal';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Performance-optimized 3D wireframe shapes.
 * 
 * REMOVED: MeshDistortMaterial (runs vertex shader every frame - massive GPU cost)
 * REMOVED: window.scrollY inside useFrame (causes layout thrashing)
 * REPLACED WITH: Lenis-friendly scroll tracking via a ref updated outside the render loop
 * REDUCED: Canvas overflow from inset-[-120%] to inset-[-60%] (3.4x → 2.2x viewport)
 */

// Shared scroll position ref to avoid layout thrashing
const scrollRef = { current: 0 };
if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
        scrollRef.current = window.scrollY;
    }, { passive: true });
}

function FunkyShapes() {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const scroll = scrollRef.current;

        if (outerRef.current) {
            outerRef.current.rotation.y += 0.003;
            outerRef.current.rotation.x += 0.002;
            outerRef.current.rotation.z = scroll * 0.001;

            const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
            outerRef.current.scale.setScalar(scale);
        }
        if (innerRef.current) {
            innerRef.current.rotation.y -= 0.004;
            innerRef.current.rotation.x -= 0.002;
            innerRef.current.rotation.z = scroll * -0.0012;
        }
    });

    return (
        <Float speed={3} rotationIntensity={2} floatIntensity={2.5}>
            <group>
                {/* Broad Outer Icosahedron - emissive wireframe */}
                <Icosahedron ref={outerRef} args={[3.2, 0]} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#ffffff"
                        wireframe
                        emissive="#ffffff"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.3}
                    />
                </Icosahedron>

                {/* Inner rotating wireframe icosahedron */}
                <Icosahedron ref={innerRef} args={[1.5, 1]} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#ffffff"
                        wireframe
                        emissive="#ffffff"
                        emissiveIntensity={0.3}
                        transparent
                        opacity={0.4}
                    />
                </Icosahedron>
            </group>
        </Float>
    );
}

/** Automatically lower pixel ratio on this canvas for perf */
function AdaptiveDpr() {
    const { gl } = useThree();
    useEffect(() => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    }, [gl]);
    return null;
}

export default function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const numberRef = useRef<HTMLDivElement>(null);
    const imageRevealRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !numberRef.current || !imageRevealRef.current) return;

        gsap.to(numberRef.current, {
            scale: 0.5,
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'center center',
                end: 'bottom top',
                scrub: true,
            }
        });

        gsap.fromTo(
            imageRevealRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.5,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                }
            }
        );

        gsap.to(imageRevealRef.current, {
            yPercent: -10,
            scale: 1.03,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });

    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen bg-[#000000] text-white px-6 py-24 md:px-[6vw] md:py-[12vw] flex flex-col md:flex-row overflow-hidden"
        >
            {/* Left Column - Sticky */}
            <div className="w-full md:w-[40%] flex flex-col mb-16 md:mb-0 relative">
                <div className="md:sticky md:top-32 h-fit pr-10">
                    <div
                        ref={numberRef}
                        className="font-display text-8xl md:text-[10vw] leading-none text-white/20 tracking-tighter mb-12 origin-top-left font-medium"
                    >
                        01
                    </div>

                    <TextReveal
                        text="A passionate photographer and filmmaker with a keen eye for storytelling through visuals."
                        as="h2"
                        className="font-display text-3xl md:text-5xl leading-tight mb-8"
                    />

                    <div className="space-y-6 text-white/60 font-body font-light text-base md:text-lg max-w-md">
                        <p>
                            Over the years, I have honed my skills behind the lens to capture moments that evoke deep emotion and authentic narratives.
                        </p>
                        <p>
                            Whether it&apos;s a high-profile celebrity shoot, an intensive brand campaign, or the subtle ambiance of a lifestyle moment, my approach strips away the noise to focus entirely on the cinematic truth.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-[60%] flex items-center justify-end mt-12 md:mt-0 relative">

                <div
                    ref={imageRevealRef}
                    className="w-[85%] md:w-[50%] aspect-[3/4] relative group cursor-pointer"
                >
                    {/* 3D Overlay Canvas temporarily disabled based on request to stop animation */}
                    {/* <div className="absolute inset-[-60%] z-20 pointer-events-none">...</div> */}

                    {/* Image Container */}
                    <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden rounded-[2rem] shadow-[0_0_60px_rgba(255,255,255,0.1)] bg-[#111] z-10">
                        <ParallaxImage
                            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"
                            alt="Client Portrait"
                            className="w-full h-full object-cover opacity-100"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
