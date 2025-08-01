"use client";

import { useEffect, useState } from 'react';

export default function TerminalTypeText({ text, className = '' }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) {
        clearInterval(interval);
        return;
      }
      setDisplayed((prev) => prev + text[i]);
      i++;
    }, 32);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span className={`font-mono text-accent-foreground/90 ${className}`}>{displayed}<span className="animate-pulse">_</span></span>
  );
}
