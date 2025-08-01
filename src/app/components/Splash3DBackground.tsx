"use client";
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

function DNA() {
  // Simple DNA helix using spheres and cylinders
  const group = useRef<THREE.Group>(null);
  const basePairs = Array.from({ length: 16 });
  return (
    <group ref={group}>
      {basePairs.map((_, i) => {
        const t = (i / basePairs.length) * Math.PI * 4;
        const x = Math.sin(t) * 1.2;
        const y = (i - basePairs.length / 2) * 0.3;
        const z = Math.cos(t) * 1.2;
        return (
          <>
            <mesh position={[x, y, z]} key={`sphere1-${i}`}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#7dd3fc" emissive="#0ea5e9" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-x, y, -z]} key={`sphere2-${i}`}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color="#c084fc" emissive="#a21caf" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, y, 0]} key={`cylinder-${i}`}>
              <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
              <meshStandardMaterial color="#fff" opacity={0.15} transparent />
            </mesh>
          </>
        );
      })}
    </group>
  );
}

export default function Splash3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 2]} intensity={0.7} />
        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
            <DNA />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
