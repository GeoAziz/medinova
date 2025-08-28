import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, PlusCircle, Microscope, Heart, Activity, Thermometer } from 'lucide-react';
import { mockPatient, mockAppointments, mockPrescriptions } from '@/lib/data';

export default function PatientDashboard() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Upcoming');

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Welcome, ${mockPatient.name}`}
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
                  {upcomingAppointments.length > 0 ? upcomingAppointments.map(apt => (
                    <TableRow key={apt.id}>
                      <TableCell>{apt.doctor}</TableCell>
                      <TableCell>{apt.specialty}</TableCell>
                      <TableCell>{apt.date}</TableCell>
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
                  {mockPrescriptions.map(p => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
