import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
<<<<<<< HEAD
import { MoveRight, Languages, Accessibility } from 'lucide-react';
=======
import { MoveRight } from 'lucide-react';
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6

export default function SplashPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
<<<<<<< HEAD
      <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern animate-background-pan" />
=======
      <div className="absolute inset-0 z-0 opacity-20 bg-grid-pattern" />
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
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
<<<<<<< HEAD
          Revolutionizing Health Access with AI and Immersion
=======
          A New Era in Virtual Health
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
        </p>
        <Link href="/auth" className="mt-12">
          <Button
            size="lg"
<<<<<<< HEAD
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
=======
            className="group relative bg-primary/90 text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-[0_0_20px_hsl(var(--primary))] animate-fade-in-up animation-delay-600"
          >
            Enter System
            <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-accent" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent" />
          </Button>
        </Link>
      </main>
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
    </div>
  );
}
