'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { MoveRight, Languages, Accessibility } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import SplashPreloader from './components/SplashPreloader';
import GlitchScanlineOverlay from './components/GlitchScanlineOverlay';
import TerminalTypeText from './components/TerminalTypeText';

const InteractiveGrid = () => {
  // Mouse-reactive grid overlay
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function handleMove(e: MouseEvent) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      if (el) {
        el.style.backgroundPosition = `${50 + x * 8}% ${50 + y * 8}%`;
      }
    }
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 opacity-20 bg-grid-pattern animate-background-pan pointer-events-none"
      style={{ transition: 'background-position 0.2s cubic-bezier(.4,2,.6,1)' }}
    />
  );
};
  
const Page = () => {
    const [preloaderDone, setPreloaderDone] = useState(false);
  
    return (
      <>
        {!preloaderDone && <SplashPreloader onFinish={() => setPreloaderDone(true)} />}
        {preloaderDone && (
          <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
            <InteractiveGrid />
            <GlitchScanlineOverlay />
  
            <main className="z-10 flex flex-col items-center justify-center text-center">
              <div className="animate-fade-in-up">
                <Logo className="h-auto w-64 md:w-96" />
              </div>
              <div className="mt-2 text-lg text-primary-foreground/80 md:text-xl animate-fade-in-up animation-delay-300">
                <TerminalTypeText text="Revolutionizing Health Access with AI and Immersion" />
              </div>
              <Link href="/auth" className="mt-12">
                <Button
                  size="lg"
                  className="group relative bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-[0_0_20px_hsl(var(--primary))] animate-fade-in-up animation-delay-600 animate-pulse-glow"
                >
                  Enter
                  <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </main>
  
            <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground">
              v1.0.0-beta
            </div>
  
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Language</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Accessibility className="h-5 w-5" />
                <span className="sr-only">Accessibility</span>
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default Page;
