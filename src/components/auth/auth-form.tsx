'use client';

<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Loader2 } from 'lucide-react';
import { getAuth, signInWithEmailAndPassword, type User } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
=======
import { useState } from 'react';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Bot, User, UserCog, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
<<<<<<< HEAD
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { app } from '@/lib/firebase';
=======
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type Role = 'patient' | 'doctor' | 'admin';
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

<<<<<<< HEAD
type LoginValues = z.infer<typeof loginSchema>;
=======
const signupSchema = z.object({
  role: z.enum(['patient', 'doctor', 'admin']),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  // Role-specific fields
  dob: z.string().optional(),
  licenseNumber: z.string().optional(),
  specialization: z.string().optional(),
  adminKey: z.string().optional(),
}).refine(data => {
    if (data.role === 'patient') return !!data.dob;
    if (data.role === 'doctor') return !!data.licenseNumber && !!data.specialization;
    if (data.role === 'admin') return !!data.adminKey;
    return false;
}, {
    message: "Please fill in all required fields for your role.",
    path: ["role"],
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6

export function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
<<<<<<< HEAD
=======
  const [role, setRole] = useState<Role>('patient');
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

<<<<<<< HEAD
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
=======
  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'patient', name: '', email: '', password: '' },
  });

  const onLoginSubmit: SubmitHandler<LoginValues> = (data) => {
    toast({
      title: 'Login Successful',
      description: `Welcome back! Redirecting to ${role} dashboard...`,
    });
    router.push(`/${role}/dashboard`);
  };

  const onSignupSubmit: SubmitHandler<SignupValues> = (data) => {
    toast({
      title: 'Signup Successful',
      description: `Welcome to MediNova! Your account has been created.`,
    });
    router.push(`/${role}/dashboard`);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    signupForm.setValue('role', newRole);
  };
  
  const roleIcons = {
    patient: <User className="mr-2 h-4 w-4" />,
    doctor: <Bot className="mr-2 h-4 w-4" />,
    admin: <UserCog className="mr-2 h-4 w-4" />,
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle>Access System</CardTitle>
            <CardDescription>Enter your credentials to log in.</CardDescription>
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
                        <Input placeholder="user@medinova.io" {...field} />
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
                 <RadioGroup defaultValue={role} onValueChange={(v) => setRole(v as Role)} className="grid grid-cols-3 gap-4 pt-2">
                  <div><RadioGroupItem value="patient" id="r1" className="peer sr-only" /><Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Patient</Label></div>
                  <div><RadioGroupItem value="doctor" id="r2" className="peer sr-only" /><Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Doctor</Label></div>
                  <div><RadioGroupItem value="admin" id="r3" className="peer sr-only" /><Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">Admin</Label></div>
                 </RadioGroup>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button type="submit" className="w-full">Login</Button>
                <Button variant="link" size="sm" className="mt-2 text-muted-foreground">Forgot password?</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Register as a patient, doctor, or admin.</CardDescription>
          </CardHeader>
           <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
              <CardContent className="space-y-4">
                 <FormField
                  control={signupForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRoleChange(value as Role);
                          }}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="patient" /></FormControl>
                            <FormLabel className="font-normal">Patient</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="doctor" /></FormControl>
                            <FormLabel className="font-normal">Doctor</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="admin" /></FormControl>
                            <FormLabel className="font-normal">Admin</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField control={signupForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={signupForm.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="user@medinova.io" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={signupForm.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="********" {...field} /></FormControl><FormMessage /></FormItem> )} />

                {role === 'patient' && (
                    <FormField control={signupForm.control} name="dob" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                )}
                {role === 'doctor' && (
                    <>
                        <FormField control={signupForm.control} name="licenseNumber" render={({ field }) => ( <FormItem><FormLabel>Medical License Number</FormLabel><FormControl><Input placeholder="LIC-12345" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={signupForm.control} name="specialization" render={({ field }) => ( <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input placeholder="Cardiology" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </>
                )}
                {role === 'admin' && (
                    <FormField control={signupForm.control} name="adminKey" render={({ field }) => ( <FormItem><FormLabel>Admin Key</FormLabel><FormControl><Input type="password" placeholder="Secret Key" {...field} /></FormControl><FormMessage /></FormItem> )} />
                )}

              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
>>>>>>> fd9a66060fb5141d7bacd2d75f9d6bd0af4497b6
  );
}
