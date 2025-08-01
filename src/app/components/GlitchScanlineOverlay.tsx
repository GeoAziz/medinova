"use client";
import { useEffect, useRef } from 'react';

export default function GlitchScanlineOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Scanlines
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#fff';
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1);
      }
      ctx.globalAlpha = 1;
      // Glitch
      if (Math.random() < 0.08) {
        const glitchY = Math.random() * canvas.height;
        ctx.fillStyle = '#0ff';
        ctx.fillRect(Math.random() * canvas.width, glitchY, 80, 2);
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className="fixed inset-0 z-30 pointer-events-none mix-blend-screen"
      style={{ opacity: 0.18 }}
    />
  );
}
