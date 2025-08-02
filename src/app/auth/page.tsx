"use client";
import { Logo } from '@/components/icons/logo';
import { AuthForm } from '@/components/auth/auth-form';
import HologramClientWrapper from '@/components-client/HologramClientWrapper';

export default function AuthPage() {
  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-2">
      {/* Left Pane: Visuals + 3D Hologram */}
      <div className="relative hidden items-center justify-center bg-secondary p-8 md:flex">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1), transparent 30%), 
                              radial-gradient(circle at 75% 75%, hsl(var(--accent) / 0.1), transparent 30%)`,
          }}
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <HologramClientWrapper />
        </div>
        <div className="z-20 text-center">
          <Logo className="h-auto w-80 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            Your AI-driven Health Command Center
          </h2>
          <p className="text-muted-foreground">
            Login to enter the MediVerse.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Right Pane: Auth Form */}
      <div className="flex flex-col items-center justify-center bg-background p-4">
        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="mb-8 block md:hidden">
            <Logo className="h-auto w-48" />
          </div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
