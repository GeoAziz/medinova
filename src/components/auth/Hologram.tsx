"use client";
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useRef } from 'react';

function WireframeDNA() {
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
          <>
            <mesh position={[x, y, z]} key={`sphere1-${i}`}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshBasicMaterial color="#0ff" wireframe opacity={0.7} />
            </mesh>
            <mesh position={[-x, y, -z]} key={`sphere2-${i}`}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshBasicMaterial color="#f0f" wireframe opacity={0.7} />
            </mesh>
            <mesh position={[0, y, 0]} key={`cylinder-${i}`}>
              <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
              <meshBasicMaterial color="#fff" wireframe opacity={0.3} />
            </mesh>
          </>
        );
      })}
    </group>
  );
}

export default function Hologram() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <Float speed={1.2} rotationIntensity={0.7} floatIntensity={0.8}>
        <WireframeDNA />
      </Float>
    </Canvas>
  );
}
