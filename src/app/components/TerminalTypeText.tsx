import { useEffect, useState } from 'react';

export default function TerminalTypeText({ text, className = '' }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 32);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span className={`font-mono text-accent-foreground/90 ${className}`}>{displayed}<span className="animate-pulse">_</span></span>
  );
}
