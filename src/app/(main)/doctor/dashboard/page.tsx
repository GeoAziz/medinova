import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockDoctor, mockDoctorPatients, mockDoctorSchedule } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { AiAssistantModal } from '@/components/doctor/ai-assistant-modal';
import { PrescriptionModal } from '@/components/doctor/prescription-modal';
import Link from 'next/link';
import { FlaskConical, Stethoscope, BrainCircuit } from 'lucide-react';

export default function DoctorDashboard() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Doctor's Console`}
        description={`Welcome, ${mockDoctor.name}. Here are your patients and schedule.`}
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
                    <TableHead>Last Appointment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {mockDoctorPatients.map(patient => (
                    <TableRow key={patient.id} className="cursor-pointer">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                          <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.lastAppointment}</TableCell>
                    </TableRow>
                  ))}
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
                  {mockDoctorSchedule.map(apt => (
                    <TableRow key={apt.time}>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.patient}</TableCell>
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
