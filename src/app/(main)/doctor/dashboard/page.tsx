import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, FilePlus, Sparkles } from 'lucide-react';
import { mockDoctor, mockDoctorPatients, mockDoctorSchedule } from '@/lib/data';
import { PrescriptionModal } from '@/components/doctor/prescription-modal';
import { AiAssistantModal } from '@/components/doctor/ai-assistant-modal';

export default function DoctorDashboard() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Welcome, ${mockDoctor.name}`}
        description="Here's your overview for today."
        actions={
          <div className="flex items-center space-x-2">
            <Switch id="availability" />
            <Label htmlFor="availability">Available for new consults</Label>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDoctorSchedule.map(apt => (
                    <TableRow key={apt.time}>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.patient}</TableCell>
                      <TableCell><Badge variant="secondary">{apt.type}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>Assigned Patients</CardTitle>
              <CardDescription>Click on a patient to view their profile.</CardDescription>
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot /> AI Assistant</CardTitle>
              <CardDescription>Your AI-powered medical co-pilot.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Leverage AI to summarize history, suggest treatments, and generate notes.</p>
              <div className="flex flex-col gap-2">
                <AiAssistantModal />
                <PrescriptionModal />
              </div>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
