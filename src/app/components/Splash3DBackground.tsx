"use client";
import React from 'react';
import { useEffect, useRef, useState } from 'react';

// Only render the 3D Canvas on the client to avoid SSR errors
export default function Splash3DBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically import 3D libraries only on the client
  const [ThreeComponents, setThreeComponents] = useState<any>(null);
  useEffect(() => {
    if (!mounted) return;
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three'),
    ]).then(([fiber, drei, THREE]) => {
      setThreeComponents({ fiber, drei, THREE });
    });
  }, [mounted]);

  if (!mounted || !ThreeComponents) return null;

  const { Canvas } = ThreeComponents.fiber;
  const { OrbitControls, Float } = ThreeComponents.drei;
  const THREE = ThreeComponents.THREE;

  // DNA helix component using dynamically imported THREE
  function DNA() {
    const group = useRef<any>(null);
    const basePairs = Array.from({ length: 16 });
    return (
      <group ref={group}>
        {basePairs.map((_, i) => {
          const t = (i / basePairs.length) * Math.PI * 4;
          const x = Math.sin(t) * 1.2;
          const y = (i - basePairs.length / 2) * 0.3;
          const z = Math.cos(t) * 1.2;
          return (
            <React.Fragment key={i}>
              <mesh position={[x, y, z]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#7dd3fc" emissive="#0ea5e9" emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[-x, y, -z]}>
                <sphereGeometry args={[0.13, 16, 16]} />
                <meshStandardMaterial color="#c084fc" emissive="#a21caf" emissiveIntensity={0.5} />
              </mesh>
              <mesh position={[0, y, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
                <meshStandardMaterial color="#fff" opacity={0.15} transparent />
              </mesh>
            </React.Fragment>
          );
        })}
      </group>
    );
  }

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 2]} intensity={0.7} />
        <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
          <DNA />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
