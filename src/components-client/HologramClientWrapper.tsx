
"use client";
import React from "react";
import dynamic from "next/dynamic";

const HologramCanvas = dynamic(
  () => {
    return Promise.all([
      import("@react-three/fiber"),
      import("@react-three/drei")
    ]).then(([fiber, drei]) => {
      const { Canvas } = fiber;
      const { Float } = drei;

      function WireframeDNA() {
        const group = React.useRef(null);
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

      const HologramComponent = React.forwardRef((props, ref) => {
        return (
          <Canvas 
            camera={{ position: [0, 0, 7], fov: 50 }} 
            style={{ width: "100%", height: "100%" }}
            {...props}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[2, 4, 2]} intensity={0.7} />
            <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.7}>
              <WireframeDNA />
            </Float>
          </Canvas>
        );
      });

      HologramComponent.displayName = "HologramComponent";
      return HologramComponent;
    });
  },
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-blue-400 text-sm">Loading 3D Hologram...</div>
      </div>
    )
  }
);

export default function HologramClientWrapper() {
  return (
    <div className="w-full h-full">
      <HologramCanvas />
    </div>
  );
}
