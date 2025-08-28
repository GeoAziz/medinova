"use client";
import React from "react";
import dynamic from "next/dynamic";

const Hologram = dynamic(
  () => import('./Hologram'),
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
      <Hologram />
    </div>
  );
}
