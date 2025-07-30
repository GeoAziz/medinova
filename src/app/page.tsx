import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { MoveRight } from 'lucide-react';

export default function SplashPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern" />
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at top left, hsl(var(--primary) / 0.1), transparent 40%), 
                            radial-gradient(circle at bottom right, hsl(var(--accent) / 0.1), transparent 40%)`,
        }}
      />
      
      <main className="z-10 flex flex-col items-center justify-center text-center">
        <div className="animate-fade-in-up">
          <Logo className="h-auto w-64 md:w-96" />
        </div>
        <p className="mt-2 text-lg text-primary-foreground/80 md:text-xl animate-fade-in-up animation-delay-300">
          A New Era in Virtual Health
        </p>
        <Link href="/auth" className="mt-12">
          <Button
            size="lg"
            className="group relative bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-[0_0_20px_hsl(var(--primary))] animate-fade-in-up animation-delay-600"
          >
            Enter System
            <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-accent" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent" />
          </Button>
        </Link>
      </main>
    </div>
  );
}
