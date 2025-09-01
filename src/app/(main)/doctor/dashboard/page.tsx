
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AiAssistantModal } from '@/components/doctor/ai-assistant-modal';
import { PrescriptionModal } from '@/components/doctor/prescription-modal';
import Link from 'next/link';
import { FlaskConical, Stethoscope, BrainCircuit, Bot, FileVideo } from 'lucide-react';
import Image from 'next/image';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getDoctorDashboardData, getDoctorBriefing } from '@/lib/actions/doctor-dashboard.actions';
import { Badge } from '@/components/ui/badge';

export default async function DoctorDashboard() {
  const user = await getAuthenticatedUser();
  
  if (!user || user.role !== 'doctor') {
    return <p>Unauthorized</p>;
  }

  const { assignedPatients, upcomingAppointments } = await getDoctorDashboardData(user.uid);
  const briefing = await getDoctorBriefing(user.fullName, assignedPatients, upcomingAppointments);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Doctor's Console`}
        description={`Welcome, ${user.fullName}. Here is your operational overview.`}
        actions={
          <div className="flex gap-2">
            <PrescriptionModal />
            <AiAssistantModal />
          </div>
        }
      />
      <div className="space-y-6">
        <GlowingCard>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> Zizo's Briefing</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{briefing}</p>
            </CardContent>
        </GlowingCard>

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
                        <TableHead>Patient</TableHead>
                        <TableHead>Primary Diagnosis</TableHead>
                        <TableHead>Condition</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {assignedPatients.length > 0 ? assignedPatients.map(patient => (
                        <TableRow key={patient.id} className="cursor-pointer">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                <Image src={`https://picsum.photos/seed/${patient.id}/40/40`} width={40} height={40} data-ai-hint="person portrait" alt={patient.name} />
                                <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span>{patient.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{patient.diagnosis || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant={patient.condition === 'Critical' ? 'destructive' : patient.condition === 'Needs Monitoring' ? 'secondary' : 'default'}
                                   className={patient.condition === 'Stable' ? 'bg-green-600/80' : ''}>
                                {patient.condition || 'N/A'}
                            </Badge>
                        </TableCell>
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
                </CardHeader>

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
                        <TableHead>Action</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {upcomingAppointments.length > 0 ? upcomingAppointments.map(apt => (
                        <TableRow key={apt.id}>
                        <TableCell>{apt.time}</TableCell>
                        <TableCell>{apt.patientName}</TableCell>
                        <TableCell>
                            <Button size="sm" variant="outline" disabled>
                                <FileVideo className="mr-2 h-4 w-4"/> Start
                            </Button>
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No upcoming appointments.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </GlowingCard>
            </div>
        </div>
      </div>
    </div>
  );
}
