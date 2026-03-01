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
    Environment, // Added for realistic reflections
    ContactShadows, // Added cheap shadow for grounding
} from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
 * CINEMATIC DSLR CAMERA — "Deconstructed" Floating Assembly
 * (Enhanced Realism Version)
 * ═══════════════════════════════════════════════════════════════ */

const ACCENT_GOLD = '#D4AF37'; // Slightly warmer real gold
const PARTICLE_COUNT = 60; // Reduced count slightly to afford better materials

/* ─── Floating Particle Field (Lens Dust / Bokeh) ─── */
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 15;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y += 0.0005;
        pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                    count={PARTICLE_COUNT}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#ffffff"
                size={0.05}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/* ─── Orbiting Light Rings ─── */
function OrbitingRings() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
            groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
            groupRef.current.rotation.x = state.clock.elapsedTime * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Core Gold Ring */}
            <Torus args={[4.2, 0.01, 16, 64]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color={ACCENT_GOLD} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
            </Torus>

            {/* Deep Blue Orbital */}
            <Torus args={[5.0, 0.008, 16, 64]} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
                <meshBasicMaterial color="#4466ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </Torus>

            {/* Chaotic Purple Ring */}
            <Torus args={[3.5, 0.015, 16, 64]} rotation={[-Math.PI / 3, 0, Math.PI / 4]}>
                <meshBasicMaterial color="#8800ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </Torus>

            {/* Inner Cyan Glowing Thread */}
            <Torus args={[2.8, 0.005, 16, 64]} rotation={[Math.PI / 2, Math.PI / 2, 0]}>
                <meshBasicMaterial color="#00ffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
            </Torus>

            {/* Massive Outer Halo */}
            <Torus args={[6.5, 0.002, 16, 128]} rotation={[0, Math.PI / 2, 0]}>
                <meshBasicMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
            </Torus>
        </group>
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
        const breathe = Math.sin(t * 0.5) * 0.1;
        const breathe2 = Math.cos(t * 0.4) * 0.08;

        if (bodyRef.current) bodyRef.current.position.y = breathe * 0.3;
        if (gripRef.current) {
            gripRef.current.position.x = 1.3 + breathe2 * 0.5;
            gripRef.current.position.y = breathe * 0.2;
        }
        if (viewfinderRef.current) viewfinderRef.current.position.y = 1.3 + Math.abs(breathe) * 0.8;
        if (lensRef.current) lensRef.current.position.z = 0.6 + breathe * 0.4;
        if (outerLensRef.current) {
            outerLensRef.current.position.z = 1.2 + breathe * 0.8;
            outerLensRef.current.rotation.z = t * 0.1; // Slower, more premium rotation
        }
    });

    // --- REALISTIC MATERIALS CONFIG ---
    // Magnesium Alloy (Body): Dark, slightly rough, but has specular highlights
    const bodyMaterial = (
        <meshPhysicalMaterial
            color="#111111"
            roughness={0.6}
            metalness={0.4}
            clearcoat={0.3} // Gives that "painted metal" look
            clearcoatRoughness={0.4}
        />
    );

    // Rubber Grip: High roughness, very dark
    const gripMaterial = (
        <meshStandardMaterial color="#080808" roughness={0.9} metalness={0.1} />
    );

    // Anodized Aluminum (Lens Barrel): Metallic, semi-rough
    const metalMaterial = (
        <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.8} />
    );

    // Gold Plating (Contacts/Rings)
    const goldMaterial = (
        <meshStandardMaterial color={ACCENT_GOLD} roughness={0.2} metalness={1.0} />
    );

    // Optical Glass (The "Hero" Material)
    // Uses iridescence to mimic lens coatings (Purple/Green reflection)
    const glassMaterial = (
        <meshPhysicalMaterial
            color="#000000"
            roughness={0.05}
            metalness={0.9} // Fake glass using high metalness (cheaper than transmission)
            iridescence={1}
            iridescenceIOR={1.3}
            iridescenceThicknessRange={[100, 400]} // Creates the purple/blue tint
        />
    );

    return (
        <group>
            {/* Camera Body */}
            <group ref={bodyRef}>
                <RoundedBox args={[3.2, 2.2, 1.2]} radius={0.2} smoothness={4}>
                    {bodyMaterial}
                </RoundedBox>
                {/* Red recording dot */}
                <Cylinder args={[0.08, 0.08, 0.05]} position={[1.3, 0.8, 0.61]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#ff0000" />
                </Cylinder>
            </group>

            {/* Grip */}
            <group ref={gripRef} position={[1.3, 0, 0.4]}>
                <RoundedBox args={[1, 2.3, 1.5]} radius={0.3} smoothness={4}>
                    {gripMaterial}
                </RoundedBox>
                {/* Shutter Button (Chrome) */}
                <Cylinder args={[0.18, 0.18, 0.1]} position={[0.1, 1.15, -0.3]}>
                    <meshStandardMaterial color="#555" roughness={0.1} metalness={1} />
                </Cylinder>
            </group>

            {/* Viewfinder */}
            <group ref={viewfinderRef} position={[0, 1.3, -0.1]}>
                <RoundedBox args={[1.2, 0.8, 1.2]} radius={0.15} smoothness={4}>
                    {bodyMaterial}
                </RoundedBox>
                <Cylinder args={[0.3, 0.35, 0.2]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.6]}>
                    <meshStandardMaterial color="#050505" roughness={0.4} />
                </Cylinder>
            </group>

            {/* Inner Lens Barrel */}
            <group ref={lensRef} position={[0, 0, 0.6]}>
                <Cylinder args={[0.95, 0.95, 1.0]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
                    {metalMaterial}
                </Cylinder>
                {/* Gold Ring */}
                <Cylinder args={[1.02, 1.02, 0.05]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
                    {goldMaterial}
                </Cylinder>
            </group>

            {/* Outer Lens & Glass */}
            <group ref={outerLensRef} position={[0, 0, 1.2]}>
                <Cylinder args={[1.0, 1.0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
                </Cylinder>
                {/* The Glass Element */}
                <Cylinder args={[0.9, 0.9, 0.05]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.16]}>
                    {glassMaterial}
                </Cylinder>
                {/* Inner reflection fake */}
                <Ring args={[0.3, 0.8, 32]} position={[0, 0, 0.17]} rotation={[0, 0, 0]}>
                    <meshBasicMaterial color="#3300ff" opacity={0.05} transparent blending={THREE.AdditiveBlending} />
                </Ring>
            </group>
        </group>
    );
}

/* ─── Scene Rig ─── */
function SceneRig() {
    const group = useRef<THREE.Group>(null);
    const scrollData = useRef(0);

    React.useEffect(() => {
        const onScroll = () => {
            // Track scroll progress purely over the first 100vh
            const scrollNorm = Math.min(window.scrollY / window.innerHeight, 1);
            scrollData.current = scrollNorm;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Init
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useFrame((state) => {
        if (!group.current) return;

        // 1. Sticky Mouse Tracking: Directly faces the lens forward, highly responsive
        const targetRotationY = state.mouse.x * 0.8;
        const targetRotationX = -state.mouse.y * 0.6;

        // 2. Scroll Effects: Rotate up to ~90° and Zoom 20% as you scroll down
        const scrollRotY = scrollData.current * (Math.PI * 0.6); // Moderate rotation
        const targetScale = 1 + scrollData.current * 0.2; // Zoom 20%

        // Apply with a firm lerp for that premium "sticky" feeling
        group.current.rotation.y = THREE.MathUtils.lerp(
            group.current.rotation.y,
            targetRotationY + scrollRotY,
            0.08
        );
        group.current.rotation.x = THREE.MathUtils.lerp(
            group.current.rotation.x,
            targetRotationX,
            0.08
        );

        group.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.08
        );
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <DslrCamera />
            </Float>
            <OrbitingRings />
        </group>
    );
}

/* ═══════════════════════════════════════════════════════════════
 * EXPORT — The Complete Scene
 * ═══════════════════════════════════════════════════════════════ */
export default function CameraScene() {
    return (
        <div className="absolute inset-0 w-full h-[100vh] z-0 overflow-hidden pointer-events-auto bg-[#050505]">
            <Canvas
                dpr={[1, 2]} // Optimize pixel ratio for sharpness
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} // Better colors
                camera={{ position: [0, 0, 12], fov: 35 }}
            >
                <fog attach="fog" args={['#050505', 8, 25]} />

                {/* --- REALISM UPGRADE: Environment & Lighting --- */}
                {/* 1. Environment: This reflects on the glass/metal. "City" preset is great for complex reflections. */}
                <Environment preset="city" blur={0.8} />

                {/* 2. Key Light: Warm, strong, casts definition */}
                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={200} color="#ffecd1" />

                {/* 3. Rim Light: Cool blue, stronger intensity to cut the camera out of the black bg */}
                <spotLight position={[-10, 0, -10]} angle={0.5} penumbra={1} intensity={400} color="#4455ff" />

                {/* 4. Top Down Fill */}
                <pointLight position={[0, 10, 0]} intensity={50} color="white" />

                <SceneRig />
                <ParticleField />

                {/* Grounding Shadow */}
                <ContactShadows opacity={0.4} scale={10} blur={2} far={4} color="#000000" />
            </Canvas>
        </div>
    );
}