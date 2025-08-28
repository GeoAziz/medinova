'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, PlusCircle, Microscope, Heart, Activity, Thermometer, Loader2 } from 'lucide-react';
import type { Appointment, Prescription } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

type UserProfile = {
  fullName: string;
};

export default function PatientDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser(userDocSnap.data() as UserProfile);
          }

          // Fetch appointments
          const appointmentsColRef = collection(db, 'patients', firebaseUser.uid, 'appointments');
          const appointmentsSnap = await getDocs(appointmentsColRef);
          const appointmentsData = appointmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
          setAppointments(appointmentsData.filter(a => a.status === 'Upcoming'));
          
          // Fetch prescriptions
          const prescriptionsColRef = collection(db, 'patients', firebaseUser.uid, 'prescriptions');
          const prescriptionsSnap = await getDocs(prescriptionsColRef);
          const prescriptionsData = prescriptionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), pdfUrl: '#' })) as Prescription[];
          setPrescriptions(prescriptionsData);

        } catch (error) {
            console.error("Failed to fetch patient data:", error);
        } finally {
            setLoading(false);
        }
      } else {
        // User is signed out
        setLoading(false);
        // Optionally redirect to login
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="animate-fade-in-up">
            <PageHeader
                title={`Welcome...`}
                description="Loading your personal health command center."
            />
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
             </div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Welcome, ${user?.fullName || 'User'}`}
        description="Here's your personal health command center."
        actions={
          <Button asChild>
            <Link href="/patient/book-appointment">
              <PlusCircle className="mr-2 h-4 w-4" />
              Book Appointment
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Microscope /> HoloMed Hub</CardTitle>
              <CardDescription>Explore your interactive 3D health data and reports.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-secondary/50 rounded-lg flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                   <Microscope className="w-20 h-20 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">Enter Your Visualization Center</p>
                  <p className="text-muted-foreground text-sm">View your body's systems in 3D, check live vitals, and review your medical timeline.</p>
                </div>
                <Button asChild size="lg">
                  <Link href="/patient/visualization">Launch Hub</Link>
                </Button>
              </div>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length > 0 ? appointments.map(apt => (
                    <TableRow key={apt.id}>
                      <TableCell>{apt.doctor}</TableCell>
                      <TableCell>{apt.specialty}</TableCell>
                      <TableCell>{new Date(apt.date).toLocaleDateString()}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">No upcoming appointments.</TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </GlowingCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Live Vitals</CardTitle>
            </CardHeader>
             <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-md bg-secondary/30">
                <Heart className="text-primary w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                  <p className="text-lg font-bold">72 bpm</p>
                </div>
              </div>
               <div className="flex items-center gap-4 p-3 rounded-md bg-secondary/30">
                <Activity className="text-primary w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="text-lg font-bold">120/80</p>
                </div>
              </div>
               <div className="flex items-center gap-4 p-3 rounded-md bg-secondary/30">
                <Thermometer className="text-primary w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-lg font-bold">36.8°C</p>
                </div>
              </div>
            </CardContent>
          </GlowingCard>
          <GlowingCard>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                <TableBody>
                  {prescriptions.length > 0 ? prescriptions.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="font-medium">{p.medication}</div>
                        <div className="text-sm text-muted-foreground">
                          Dr. {p.doctor}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                           <a href={p.pdfUrl} download>
                            <Download className="h-4 w-4" />
                           </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">No active prescriptions.</TableCell>
                     </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
