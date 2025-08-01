import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, PlusCircle } from 'lucide-react';
import { mockPatient, mockAppointments, mockPrescriptions, mockMedicalHistory } from '@/lib/data';

export default function PatientDashboard() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Upcoming');
  const pastAppointments = mockAppointments.filter(a => a.status === 'Past');

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Welcome, ${mockPatient.name}`}
        description="Here's your personal health overview."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                  </TabsList>
                  <Link href="/patient/book-appointment">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Book New
                    </Button>
                  </Link>
                </div>
                <TabsContent value="upcoming" className="mt-4">
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
                </TabsContent>
                <TabsContent value="past" className="mt-4">
                  <Table>
                    <TableHeader>
                       <TableRow>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Specialty</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAppointments.map(apt => (
                        <TableRow key={apt.id}>
                          <TableCell>{apt.doctor}</TableCell>
                          <TableCell>{apt.specialty}</TableCell>
                          <TableCell>{apt.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Review your past consultations and records.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {mockMedicalHistory.map(record => (
                  <AccordionItem value={record.id} key={record.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                           <span>{record.title}</span>
                           <span className="text-muted-foreground">{record.date}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>{record.summary}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </GlowingCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
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
