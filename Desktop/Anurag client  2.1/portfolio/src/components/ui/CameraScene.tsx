'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Float,
    RoundedBox,
    Cylinder,
    Ring,
    Torus,
} from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
 *  CINEMATIC DSLR CAMERA — "Deconstructed" Floating Assembly
 *  
 *  The camera body, grip, viewfinder, and lens barrel are all
 *  separate floating pieces that breathe apart and reassemble
 *  on a sine wave, creating a "disassembled product shot" look
 *  inspired by Apple product reveals.
 *  
 *  PERFORMANCE BUDGET:
 *  - No Environment cubemap (saved ~4mb + IBL pass)
 *  - No ContactShadows (saved 1 extra render pass/frame)
 *  - No meshPhysicalMaterial transmission (saved PBR complexity)
 *  - Particle count capped at 80 (instanced Points, single draw call)
 *  - All animation via useFrame (no GSAP inside R3F)
 * ═══════════════════════════════════════════════════════════════ */

const ACCENT_GOLD = '#C4A77D';
const PARTICLE_COUNT = 80;

/* ─── Floating Particle Field (Lens Dust / Bokeh) ─── */
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 18;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }
        return arr;
    }, []);

    const sizes = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i] = Math.random() * 0.04 + 0.01;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const geo = pointsRef.current.geometry;
        const posArr = geo.attributes.position.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Gentle floating drift
            posArr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.002;
            posArr[i * 3] += Math.cos(state.clock.elapsedTime * 0.2 + i * 0.5) * 0.001;

            // Wrap particles that drift too far
            if (posArr[i * 3 + 1] > 7) posArr[i * 3 + 1] = -7;
            if (posArr[i * 3 + 1] < -7) posArr[i * 3 + 1] = 7;
        }
        geo.attributes.position.needsUpdate = true;

        // Subtle overall rotation
        pointsRef.current.rotation.y += 0.0003;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={PARTICLE_COUNT}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                    count={PARTICLE_COUNT}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffffff"
                size={0.06}
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/* ─── Orbiting Light Rings (Cinematic Halos) ─── */
function OrbitingRings() {
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x = t * 0.15;
            ring1Ref.current.rotation.z = t * 0.1;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.y = t * 0.12;
            ring2Ref.current.rotation.x = Math.PI / 3 + t * 0.08;
        }
        if (ring3Ref.current) {
            ring3Ref.current.rotation.z = t * 0.18;
            ring3Ref.current.rotation.y = Math.PI / 4 + t * 0.06;
        }
    });

    return (
        <group>
            {/* Primary Gold Ring */}
            <Torus ref={ring1Ref} args={[4.2, 0.008, 16, 100]}>
                <meshBasicMaterial
                    color={ACCENT_GOLD}
                    transparent
                    opacity={0.35}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Torus>

            {/* Secondary White Ring */}
            <Torus ref={ring2Ref} args={[3.6, 0.006, 16, 100]}>
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Torus>

            {/* Tertiary Blue Ring */}
            <Torus ref={ring3Ref} args={[5.0, 0.005, 16, 100]}>
                <meshBasicMaterial
                    color="#4466ff"
                    transparent
                    opacity={0.12}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </Torus>
        </group>
    );
}

/* ─── Aperture Glow (Pulsing Lens Core) ─── */
function ApertureGlow() {
    const glowRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!glowRef.current) return;
        const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
        glowRef.current.scale.setScalar(pulse);
        const mat = glowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
    });

    return (
        <Ring ref={glowRef} args={[0.3, 0.85, 6]} position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
            <meshBasicMaterial
                color={ACCENT_GOLD}
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </Ring>
    );
}

/* ─── Deconstructed DSLR Camera ─── */
function DslrCamera() {
    const bodyRef = useRef<THREE.Group>(null);
    const gripRef = useRef<THREE.Group>(null);
    const viewfinderRef = useRef<THREE.Group>(null);
    const lensRef = useRef<THREE.Group>(null);
    const outerLensRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        // Breathing deconstructed float — pieces gently separate and come back
        const breathe = Math.sin(t * 0.6) * 0.15;
        const breathe2 = Math.sin(t * 0.6 + 1) * 0.12;

        if (bodyRef.current) {
            bodyRef.current.position.y = breathe * 0.5;
        }
        if (gripRef.current) {
            gripRef.current.position.x = 1.3 + breathe2 * 0.8;
            gripRef.current.position.y = breathe * 0.3;
        }
        if (viewfinderRef.current) {
            viewfinderRef.current.position.y = 1.3 + Math.abs(breathe) * 1.2;
        }
        if (lensRef.current) {
            lensRef.current.position.z = 0.6 + breathe2 * 0.6;
        }
        if (outerLensRef.current) {
            outerLensRef.current.position.z = 1.2 + breathe * 1.2;
            outerLensRef.current.rotation.z = t * 0.3;
        }
    });

    const bodyColor = "#141414";
    const gripColor = "#0c0c0c";
    const metalColor = "#2a2a2a";

    return (
        <group>
            {/* Camera Body */}
            <group ref={bodyRef}>
                <RoundedBox args={[3.2, 2.2, 1.2]} radius={0.15} smoothness={2}>
                    <meshStandardMaterial color={bodyColor} roughness={0.65} metalness={0.3} />
                </RoundedBox>
                {/* Recording LED */}
                <Cylinder args={[0.08, 0.08, 0.05]} position={[1.4, 0.8, 0.62]}>
                    <meshBasicMaterial color="#ff2200" />
                </Cylinder>
            </group>

            {/* Grip — floats away */}
            <group ref={gripRef} position={[1.3, 0, 0.4]}>
                <RoundedBox args={[1, 2.3, 1.5]} radius={0.3} smoothness={2}>
                    <meshStandardMaterial color={gripColor} roughness={0.95} metalness={0.05} />
                </RoundedBox>
                {/* Shutter Button */}
                <Cylinder args={[0.18, 0.18, 0.08]} position={[0.1, 1.2, -0.2]} rotation={[0, 0, 0]}>
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
                </Cylinder>
            </group>

            {/* Viewfinder — floats up */}
            <group ref={viewfinderRef} position={[0, 1.3, -0.1]}>
                <RoundedBox args={[1.1, 0.75, 1.1]} radius={0.08} smoothness={2}>
                    <meshStandardMaterial color={bodyColor} roughness={0.65} metalness={0.3} />
                </RoundedBox>
                {/* Viewfinder eyepiece */}
                <Cylinder args={[0.25, 0.28, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.65]}>
                    <meshStandardMaterial color="#0a0a0a" roughness={0.8} metalness={0.4} />
                </Cylinder>
            </group>

            {/* Inner Lens Barrel — floats forward */}
            <group ref={lensRef} position={[0, 0, 0.6]}>
                <Cylinder args={[0.95, 0.95, 1.0]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
                    <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.85} />
                </Cylinder>
                {/* Focus Ring with gold accent */}
                <Cylinder args={[1.02, 1.02, 0.15]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
                    <meshStandardMaterial color={ACCENT_GOLD} roughness={0.3} metalness={0.7} />
                </Cylinder>
            </group>

            {/* Outer Lens Element — floats furthest + rotates */}
            <group ref={outerLensRef} position={[0, 0, 1.2]}>
                <Cylinder args={[1.0, 1.0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.2} />
                </Cylinder>
                {/* Glass element */}
                <Cylinder args={[0.88, 0.88, 0.08]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]}>
                    <meshStandardMaterial color="#0a0a1a" roughness={0.05} metalness={0.98} />
                </Cylinder>
                {/* Lens Core Glow */}
                <Cylinder args={[0.5, 0.5, 0.02]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
                    <meshBasicMaterial
                        color={ACCENT_GOLD}
                        transparent
                        opacity={0.08}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </Cylinder>
            </group>

            {/* Aperture Glow Effect */}
            <ApertureGlow />
        </group>
    );
}

/* ─── Scene Rig — Mouse Tracking + Slow Auto-rotation ─── */
function SceneRig() {
    const group = useRef<THREE.Group>(null);
    const targetRotation = useRef({ x: 0, y: 0 });

    useFrame((state) => {
        if (!group.current) return;

        // Mouse-driven rotation target
        targetRotation.current.y = state.mouse.x * 0.6;
        targetRotation.current.x = -state.mouse.y * 0.4;

        // Smooth lerp toward target + slow auto-rotation
        group.current.rotation.y = THREE.MathUtils.lerp(
            group.current.rotation.y,
            targetRotation.current.y + state.clock.elapsedTime * 0.05,
            0.04
        );
        group.current.rotation.x = THREE.MathUtils.lerp(
            group.current.rotation.x,
            targetRotation.current.x,
            0.04
        );
    });

    return (
        <group ref={group}>
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
                <DslrCamera />
            </Float>
            <OrbitingRings />
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════
 *  EXPORT — The Complete Scene
 * ═══════════════════════════════════════════════════════════════ */
export default function CameraScene() {
    return (
        <div className="absolute inset-0 w-full h-[100vh] z-0 overflow-hidden pointer-events-auto bg-[#030303]">
            <Canvas
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{
                    antialias: false,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                    alpha: false,
                }}
                frameloop="always"
            >
                <PerspectiveCamera makeDefault position={[0, 0.5, 12]} fov={35} />

                {/* Fog — atmospheric depth fade */}
                <fog attach="fog" args={['#030303', 10, 28]} />

                {/* Cinematic 3-Point Lighting */}
                {/* Key Light — warm golden from upper right */}
                <spotLight
                    position={[8, 8, 8]}
                    angle={0.2}
                    penumbra={1}
                    intensity={600}
                    color="#ffddaa"
                    castShadow={false}
                />

                {/* Fill Light — cool blue from left */}
                <spotLight
                    position={[-10, 4, -6]}
                    angle={0.5}
                    penumbra={1}
                    intensity={400}
                    color="#3344ff"
                    castShadow={false}
                />

                {/* Rim Light — accent gold from behind */}
                <spotLight
                    position={[0, -2, -12]}
                    angle={0.8}
                    penumbra={1}
                    intensity={300}
                    color={ACCENT_GOLD}
                    castShadow={false}
                />

                {/* Ambient base */}
                <ambientLight intensity={0.25} />

                {/* Scene Content */}
                <SceneRig />
                <ParticleField />
            </Canvas>
        </div>
    );
}
