import { AuthForm } from '@/components/auth/auth-form';
import { Logo } from '@/components/icons/logo';

export default function AuthenticationPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
       <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, hsl(var(--primary) / 0.15), transparent 40%), 
                            radial-gradient(circle at 85% 75%, hsl(var(--accent) / 0.15), transparent 40%)`,
        }}
      />
      <div className="z-10 flex w-full max-w-md flex-col items-center">
        <Logo className="mb-8 h-auto w-48" />
        <AuthForm />
      </div>
    </div>
  );
}
