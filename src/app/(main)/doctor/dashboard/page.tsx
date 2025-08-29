
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AiAssistantModal } from '@/components/doctor/ai-assistant-modal';
import { PrescriptionModal } from '@/components/doctor/prescription-modal';
import Link from 'next/link';
import { FlaskConical, Stethoscope, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getDoctorDashboardData } from '@/lib/actions/doctor-dashboard.actions';
import type { Patient, Appointment } from '@/lib/types';

export default async function DoctorDashboard() {
  const user = await getAuthenticatedUser();
  
  if (!user || user.role !== 'doctor') {
    // This should be handled by middleware in a real app
    return <p>Unauthorized</p>;
  }

  const { assignedPatients, upcomingAppointments } = await getDoctorDashboardData(user.uid);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Doctor's Console`}
        description={`Welcome, ${user.fullName}. Here are your patients and schedule.`}
        actions={
          <div className="flex gap-2">
            <PrescriptionModal />
            <AiAssistantModal />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Assigned Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Primary Diagnosis</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {assignedPatients.length > 0 ? assignedPatients.map(patient => (
                    <TableRow key={patient.id} className="cursor-pointer">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <Image src={`https://picsum.photos/seed/${patient.id}/40/40`} width={40} height={40} data-ai-hint="person portrait" alt={patient.name} />
                          <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.diagnosis || 'N/A'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">No patients assigned.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </GlowingCard>
          
           <GlowingCard>
              <CardHeader>
                <CardTitle>Diagnostics Panel</CardTitle>
                <CardDescription>Access advanced visualization and AI diagnostic tools.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/doctor/diagnostics"><BrainCircuit className="mr-2 h-4 w-4" /> AI Diagnostics</Link>
                </Button>
                <Button variant="outline" className="flex-1" disabled><Stethoscope className="mr-2 h-4 w-4" /> View 3D Organ Models</Button>
                <Button variant="outline" className="flex-1" disabled><FlaskConical className="mr-2 h-4 w-4" /> Radiology Viewer</Button>
              </CardContent>
            </GlowingCard>

        </div>

        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.length > 0 ? upcomingAppointments.map(apt => (
                    <TableRow key={apt.id}>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.patientName}</TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={2} className="text-center h-24">No upcoming appointments.</TableCell>
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
