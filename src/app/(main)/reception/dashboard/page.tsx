
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, UserPlus, Bot, Check, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getReceptionistDashboardData } from '@/lib/actions/receptionist-dashboard.actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default async function ReceptionDashboard() {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== 'receptionist') {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
    );
  }

  const { 
    todaysAppointments, 
    upcomingAppointmentsCount,
    walkInsToday,
    checkedInCount,
  } = await getReceptionistDashboardData();

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Reception Command Center"
        description={`Welcome, ${user.fullName}. Here's the front desk overview.`}
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
            <div className="text-2xl font-bold">{upcomingAppointmentsCount}</div>
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
                <div className="text-2xl font-bold">{checkedInCount}</div>
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
              {todaysAppointments.length > 0 ? todaysAppointments.map(apt => (
                <TableRow key={apt.id}>
                  <TableCell>{apt.time}</TableCell>
                  <TableCell>{apt.patientName}</TableCell>
                  <TableCell>{apt.doctorName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={apt.status === 'Arrived' || apt.status === 'Checked-in' ? 'default' : apt.status === 'Confirmed' ? 'secondary' : 'destructive'}
                      className={apt.status === 'Arrived' || apt.status === 'Checked-in' ? 'bg-green-600/80' : ''}
                    >
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" disabled={apt.status === 'Arrived' || apt.status === 'Checked-in'}>
                        Check-in
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">No appointments scheduled for today.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
