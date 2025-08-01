import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bot, CalendarPlus } from 'lucide-react';
import { mockPatient, mockAppointments } from '@/lib/data';

export default function PatientDashboard() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Upcoming');

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Health Overview`}
        description={`Welcome back, ${mockPatient.name}. Here is your health summary.`}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Appointments</CardTitle>
                <Link href="/patient/book-appointment">
                    <Button>
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Book Appointment
                    </Button>
                </Link>
              </div>
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
                      {upcomingAppointments.map(apt => (
                        <TableRow key={apt.id}>
                          <TableCell>{apt.doctor}</TableCell>
                          <TableCell>{apt.specialty}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                          <TableCell>{apt.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
            </CardContent>
          </GlowingCard>
        </div>

        <div className="space-y-6">
           <GlowingCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot /> AI Assistant</CardTitle>
              <CardDescription>Your personal AI health guide.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Get answers to your health questions, summarize your records, and more.</p>
              <Button className="w-full mt-4">Launch AI Assistant</Button>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
