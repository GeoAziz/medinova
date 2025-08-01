'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Loader2 } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, type User } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { app } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLoginSubmit: SubmitHandler<LoginValues> = async (data) => {
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Force refresh the token to get custom claims
      const idTokenResult = await user.getIdTokenResult(true);
      const userRole = idTokenResult.claims.role;

      if (userRole) {
        const roleToPath: { [key: string]: string } = {
            'admin': 'admin',
            'doctor': 'doctor',
            'patient': 'patient',
            'nurse': 'nurse',
            'lab_scientist': 'lab',
            'pharmacist': 'pharmacist',
            'receptionist': 'reception',
            'radiologist': 'radiologist',
            'medical_records_officer': 'medical-records',
        };
        const dashboardPath = roleToPath[userRole as string] || 'patient';
        
        toast({
          title: 'Login Successful',
          description: `Welcome! Redirecting to your dashboard...`,
        });

        router.push(`/${dashboardPath}/dashboard`);
      } else {
         throw new Error('User role not found. Please contact an administrator.');
      }
    } catch (error: any) {
      console.error("Authentication Error: ", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
      });
    }
  };
  
  const isSubmitting = loginForm.formState.isSubmitting;

  return (
    <Card className="w-full border-0 bg-transparent shadow-none">
      <CardHeader className="text-center">
        <CardTitle>Access Your Dashboard</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@zizoverse.io" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Verifying...' : 'Login'}
            </Button>
             <Button variant="link" size="sm" className="text-muted-foreground">Forgot password?</Button>
             <p className="text-xs text-center text-muted-foreground">
                Need an account? Contact your hospital admin.
             </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
