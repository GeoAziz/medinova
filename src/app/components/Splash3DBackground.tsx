"use client";
import dynamic from "next/dynamic";

const DNA3DScene = dynamic(() => import("./DNA3DScene"), { ssr: false });

export default function Splash3DBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <DNA3DScene />
    </div>
  );
}
