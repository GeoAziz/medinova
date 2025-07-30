'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center space-y-8 overflow-hidden p-4">
       <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, hsl(var(--primary) / 0.1), transparent 40%), 
                            radial-gradient(circle at 85% 75%, hsl(var(--accent) / 0.1), transparent 40%)`,
        }}
      />
      <Logo className="absolute top-8 left-8 h-auto w-32" />
      <div className="text-center">
        <h1 className="glitch text-7xl font-bold md:text-9xl" data-text="404">
          404
        </h1>
        <p className="mt-4 text-2xl font-light text-muted-foreground">
          System Glitch // Page Not Found
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          The requested resource could not be found in this sector.
        </p>
      </div>
      <Link href="/patient/dashboard">
        <Button
          variant="outline"
          className="bg-transparent hover:bg-primary/10 hover:text-primary"
        >
          Return to Hub
        </Button>
      </Link>
      <style jsx>{`
        .glitch {
          position: relative;
          color: hsl(var(--primary-foreground));
          text-shadow: 0.05em 0 0 hsl(var(--accent) / 0.75),
            -0.025em -0.05em 0 hsl(var(--primary) / 0.75),
            0.025em 0.05em 0 hsl(var(--secondary) / 0.75);
          animation: glitch 500ms infinite;
        }

        .glitch:before,
        .glitch:after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: hsl(var(--background));
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
        }

        .glitch:before {
          left: -0.05em;
          text-shadow: 0.02em 0.02em 0 hsl(var(--accent)), -0.05em -0.05em 0 hsl(var(--primary));
          animation: glitch-top 1s infinite;
        }

        .glitch:after {
          left: 0.05em;
          text-shadow: -0.02em -0.02em 0 hsl(var(--accent)), 0.05em 0.05em 0 hsl(var(--primary));
          animation: glitch-bottom 1.5s infinite;
        }

        @keyframes glitch {
          2%, 64% { transform: translate(0.05em, 0) skew(0deg); }
          4%, 60% { transform: translate(-0.05em, 0) skew(0deg); }
          62% { transform: translate(0, 0) skew(5deg); }
        }

        @keyframes glitch-top {
          0%, 100% { clip-path: polygon(0 20%, 100% 20%, 100% 25%, 0 25%); }
          30% { clip-path: polygon(0 45%, 100% 45%, 100% 50%, 0 50%); }
          50% { clip-path: polygon(0 70%, 100% 70%, 100% 75%, 0 75%); }
          70% { clip-path: polygon(0 90%, 100% 90%, 100% 95%, 0 95%); }
        }

        @keyframes glitch-bottom {
          0%, 100% { clip-path: inset(50% 0 30% 0); }
          25% { clip-path: inset(10% 0 80% 0); }
          50% { clip-path: inset(80% 0 5% 0); }
          75% { clip-path: inset(40% 0 45% 0); }
        }
      `}</style>
    </div>
  );
}
