import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockReceptionist, mockReceptionistAppointments } from '@/lib/data';
import { CalendarCheck, UserPlus, Bot, Check, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ReceptionDashboard() {
  const upcomingAppointments = mockReceptionistAppointments.length;
  const walkInsToday = 3; // Mock data

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Reception Command Center"
        description={`Welcome, ${mockReceptionist.name}. Here's the front desk overview.`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link href="/reception/walk-in"><UserPlus className="mr-2 h-4 w-4" /> Register Walk-in</Link></Button>
            <Button asChild><Link href="/reception/appointments"><CalendarCheck className="mr-2 h-4 w-4" /> Check-in Patient</Link></Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Walk-ins Today</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walkInsToday}</div>
            <p className="text-xs text-muted-foreground">Registered at front desk</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Patients Checked-in</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Total for today</p>
            </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Assistant (Z.A.L.I)</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mt-2 mb-3">Get help with scheduling or patient queries.</p>
            <Button size="sm" className="w-full">Activate Z.A.L.I</Button>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Today's Appointment Queue</CardTitle>
          <CardDescription>Live view of patients to be checked in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReceptionistAppointments.map(apt => (
                <TableRow key={apt.id}>
                  <TableCell>{apt.time}</TableCell>
                  <TableCell>{apt.patientName}</TableCell>
                  <TableCell>{apt.doctorName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={apt.status === 'Arrived' ? 'default' : apt.status === 'Confirmed' ? 'secondary' : 'destructive'}
                      className={apt.status === 'Arrived' ? 'bg-green-600/80' : ''}
                    >
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" disabled={apt.status === 'Arrived'}>
                        Check-in
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
