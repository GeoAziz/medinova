
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Stethoscope, User, HeartPulse, Activity, Thermometer, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Patient } from '@/app/(main)/admin/patients/page';
import type { Doctor } from '@/app/(main)/admin/doctors/page';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

// Mock data for timeline - this would be fetched in a real scenario
const mockVisitTimeline = [
  { id: 1, date: '2024-08-15', event: 'Scheduled Appointment with Dr. Reed (Cardiology)' },
  { id: 2, date: '2024-07-20', event: 'Admitted to Cardiovascular Wing, Room 301-B' },
  { id: 3, date: '2024-07-21', event: 'ECG and Bloodwork performed' },
  { id: 4, date: '2024-07-22', event: 'Diagnosis: Arrhythmia. Treatment plan initiated.' },
];

export function PatientDetailsSheet({ patient, doctors }: { patient: Patient, doctors: Doctor[] }) {
    const assignedDoctorName = doctors.find(d => d.id === patient.assignedDoctor)?.name || 'N/A';
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline"><FileText className="h-4 w-4" /></Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl p-0">
        <ScrollArea className="h-full">
            <div className="p-6">
                <SheetHeader className="mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://placehold.co/128x128.png`} alt={patient.name} data-ai-hint="person portrait" />
                            <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle className="text-2xl">{patient.name}</SheetTitle>
                            <SheetDescription>
                                Patient ID: {patient.id} | {patient.age} years old, {patient.gender}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                           <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="text-destructive"/> Primary Diagnosis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-lg">{patient.diagnosis || 'Not specified'}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="text-primary"/> Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant={patient.status === 'Critical' ? 'destructive' : 'default'}>{patient.status || 'N/A'}</Badge>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Core Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2"><User className="text-primary"/> <strong>Assigned Doctor:</strong> {assignedDoctorName}</div>
                            <div className="flex items-center gap-2"><Stethoscope className="text-primary"/> <strong>Assigned Room:</strong> {patient.room}</div>
                            <div className="flex items-center gap-2"><FileText className="text-primary"/> <strong>National ID:</strong> {patient.nationalId || 'N/A'}</div>
                            <div className="flex items-center gap-2"><Calendar className="text-primary"/> <strong>Date Added:</strong> {patient.createdAt}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Visit Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {mockVisitTimeline.map(item => (
                                <li key={item.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-primary mt-1"></div>
                                    <div className="flex-1 w-px bg-border"></div>
                                    </div>
                                    <div>
                                    <p className="font-semibold">{item.event}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                     <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Medical Record Summary</CardTitle>
                             <CardDescription>Generated on-demand by AI (placeholder).</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                                <p>{patient.notes || 'No notes available for this patient.'}</p>
                           </div>
                           <Button variant="outline" size="sm" className="mt-4">Generate AI Summary</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
