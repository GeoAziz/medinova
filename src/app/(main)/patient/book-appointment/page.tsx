
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getAvailableDoctors, createAppointment, Doctor } from '@/lib/actions/appointment.actions';
import { Skeleton } from '@/components/ui/skeleton';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const fetchedDoctors = await getAvailableDoctors();
        setDoctors(fetchedDoctors);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load doctors',
          description: 'Please try again later.',
        });
      } finally {
        setIsLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, [toast]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };
  
  const handleConfirm = async () => {
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({ variant: 'destructive', title: 'Missing information.' });
      return;
    }
    setIsSubmitting(true);
    try {
        const result = await createAppointment({
            patientId: user.uid,
            doctor: selectedDoctor,
            date: selectedDate.toISOString(),
            time: selectedTime,
        });

        if (result.type === 'success') {
            toast({
                title: "Appointment Confirmed!",
                description: `Your appointment with ${selectedDoctor.name} on ${selectedDate?.toLocaleDateString()} at ${selectedTime} is booked.`,
            });
            router.push('/patient/dashboard');
        } else {
            throw new Error(result.message);
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Booking Failed',
            description: error.message || 'Could not book the appointment. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Book an Appointment"
        description="Follow the steps to schedule your next consultation."
        actions={step > 1 ? <Button variant="outline" onClick={goBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button> : null}
      />
      
      <GlowingCard>
        {step === 1 && (
          <div>
            <CardHeader>
              <CardTitle>Step 1: Choose Your Doctor</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoadingDoctors ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
              ) : (
                doctors.map((doctor) => (
                  <Card key={doctor.id} className="cursor-pointer hover:border-primary transition-all" onClick={() => handleSelectDoctor(doctor)}>
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Avatar className="w-20 h-20 mb-4">
                        <Image src={doctor.imageURL} width={80} height={80} data-ai-hint="doctor portrait" alt={doctor.name} />
                        <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div>
            <CardHeader>
              <CardTitle>Step 2: Select Date & Time</CardTitle>
              <CardDescription>Choose a day and time for your appointment with {selectedDoctor.name}.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 h-fit">
                {timeSlots.map(time => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => handleSelectTime(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {step === 3 && selectedDoctor && selectedDate && selectedTime && (
            <div>
                 <CardHeader className="text-center">
                    <CardTitle>Step 3: Confirm Appointment</CardTitle>
                    <CardDescription>Please review the details below and confirm your booking.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <div className="space-y-4 text-center">
                        <div>
                            <p className="text-muted-foreground">Doctor</p>
                            <p className="text-xl font-semibold">{selectedDoctor.name}</p>
                            <p className="text-sm text-primary">{selectedDoctor.specialty}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="text-xl font-semibold">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="text-xl font-semibold">{selectedTime}</p>
                        </div>
                    </div>
                    <Button size="lg" onClick={handleConfirm} className="mt-4" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm & Book
                    </Button>
                </CardContent>
            </div>
        )}

      </GlowingCard>
    </div>
  );
}
