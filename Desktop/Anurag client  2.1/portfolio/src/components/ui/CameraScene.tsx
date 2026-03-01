'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    PerspectiveCamera,
    Float,
    RoundedBox,
    Cylinder
} from '@react-three/drei';
import * as THREE from 'three';

/**
 * Lightweight DSLR Camera Model
 * Removed: Environment cubemap, ContactShadows, meshPhysicalMaterial (transmission)
 * These were the top 3 GPU killers.
 */
function DslrCamera(props: JSX.IntrinsicElements['group']) {
    const group = useRef<THREE.Group>(null);
    const bodyColor = "#1a1a1a";
    const gripColor = "#0f0f0f";
    const metalColor = "#333";

    return (
        <group ref={group} {...props}>
            <RoundedBox args={[3.2, 2.2, 1.2]} radius={0.15} smoothness={2} position={[0, 0, 0]}>
                <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.2} />
            </RoundedBox>

            <RoundedBox args={[1, 2.2, 1.5]} radius={0.3} smoothness={2} position={[1.3, 0, 0.4]}>
                <meshStandardMaterial color={gripColor} roughness={0.9} />
            </RoundedBox>

            <RoundedBox args={[1.2, 0.8, 1.2]} radius={0.1} smoothness={2} position={[0, 1.3, -0.1]}>
                <meshStandardMaterial color={bodyColor} roughness={0.7} metalness={0.2} />
            </RoundedBox>

            <Cylinder args={[0.2, 0.2, 0.1]} position={[1.4, 1.1, 0.5]}>
                <meshStandardMaterial color="red" roughness={0.2} metalness={0.8} />
            </Cylinder>

            <group position={[0, 0, 0.6]}>
                <Cylinder args={[0.95, 0.95, 1.2]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.6]}>
                    <meshStandardMaterial color={metalColor} roughness={0.5} metalness={0.8} />
                </Cylinder>

                <Cylinder args={[1.0, 1.0, 0.3]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.8]}>
                    <meshStandardMaterial color="#111" roughness={1} />
                </Cylinder>

                {/* Replaced meshPhysicalMaterial (transmission) with simple reflective standard material */}
                <Cylinder args={[0.85, 0.85, 0.1]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.21]}>
                    <meshStandardMaterial color="#112" roughness={0.1} metalness={0.95} />
                </Cylinder>

                <Cylinder args={[0.7, 0.7, 0.05]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.23]}>
                    <meshBasicMaterial color="#4400ff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                </Cylinder>
            </group>
        </group>
    );
}

/**
 * Scene Rig with optimized mouse tracking
 * Uses state.mouse (already normalized, no layout thrashing)
 */
function SceneRig() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        const x = state.mouse.x * 0.5;
        const y = state.mouse.y * 0.5;
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.05);
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y, 0.05);
    });

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <DslrCamera rotation={[0, -0.5, 0]} />
            </Float>
        </group>
    );
}

export default function CameraScene() {
    return (
        <div className="absolute inset-0 w-full h-[100vh] z-0 overflow-hidden pointer-events-auto bg-[#050505]">
            <Canvas
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{
                    antialias: false,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                }}
                frameloop="always"
            >
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

                {/* Simplified lighting — no Environment cubemap, no ContactShadows */}
                <ambientLight intensity={0.6} />

                <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={500}
                    color="#ffeedd"
                />

                <spotLight
                    position={[-10, 5, -10]}
                    angle={0.5}
                    penumbra={1}
                    intensity={800}
                    color="#4455ff"
                />

                <pointLight position={[-10, -10, -10]} intensity={10} />

                <SceneRig />
            </Canvas>
        </div>
    );
}
