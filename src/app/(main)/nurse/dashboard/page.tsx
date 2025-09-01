import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Users, ClipboardList, AlertTriangle, Bot, Send } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getNurseDashboardData } from '@/lib/actions/nurse-dashboard.actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShiftBriefingModal } from '@/components/nurse/shift-briefing-modal';

export default async function NurseDashboard() {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'nurse') {
        console.log('[NURSE DASHBOARD] Unauthorized access attempt:', {
            user,
            reason: !user ? 'No user returned from getAuthenticatedUser' : `User role is ${user.role}`
        });
        return (
                <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>You do not have permission to view this page.</AlertDescription>
                </Alert>
        );
    }

  const { assignedPatients, assignedTasks, pendingTasksCount, criticalAlertsCount } = await getNurseDashboardData(user.uid);

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Nurse Command Center"
        description={`Welcome, ${user.fullName}. Here is your shift overview.`}
        actions={<ShiftBriefingModal nurseName={user.fullName} />}
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{assignedPatients.length}</div>
                <p className="text-xs text-muted-foreground">Currently under your care</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingTasksCount}</div>
                 <p className="text-xs text-muted-foreground">To be completed this shift</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{criticalAlertsCount}</div>
                 <p className="text-xs text-muted-foreground">Patients needing immediate attention</p>
            </CardContent>
        </GlowingCard>
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Assistant</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground mt-2 mb-3">Get help with summaries or task prioritization.</p>
                <Button size="sm" className="w-full">Activate Zizo_Bot</Button>
            </CardContent>
        </GlowingCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <GlowingCard>
                <CardHeader>
                <CardTitle>Patient Assignments</CardTitle>
                <CardDescription>Overview of patients in your care for this shift.</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Vitals (HR | BP)</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {assignedPatients.length > 0 ? assignedPatients.map(patient => (
                        <TableRow key={patient.id}>
                        <TableCell>{patient.room}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>
                            <Badge variant={patient.condition === 'Critical' ? 'destructive' : patient.condition === 'Needs Monitoring' ? 'secondary' : 'default'}
                                   className={patient.condition === 'Stable' ? 'bg-green-600/80' : ''}>
                                {patient.condition}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                           {patient.vitals ? `HR: ${patient.vitals.hr} | BP: ${patient.vitals.bp}` : 'N/A'}
                        </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">No patients assigned to your ward.</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </GlowingCard>
        </div>
        <div className="space-y-6">
            <GlowingCard>
                <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Prioritized tasks for your shift.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {assignedTasks.length > 0 ? assignedTasks.slice(0, 5).map(task => (
                    <div key={task.id} className={cn("flex items-center gap-3 p-2 rounded-md", task.isCompleted ? 'bg-secondary/50 opacity-60' : '')}>
                        <Checkbox id={`task-${task.id}`} checked={task.isCompleted} />
                        <div>
                        <label htmlFor={`task-${task.id}`} className="font-medium">{task.task}</label>
                        <p className="text-xs text-muted-foreground">{task.patientName} - Room {task.patientRoom}</p>
                        </div>
                        <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'} className="ml-auto">
                            {task.priority}
                        </Badge>
                    </div>
                    )) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <ClipboardList className="mx-auto h-8 w-8 mb-2" />
                            <p className="text-sm">No tasks assigned.</p>
                        </div>
                    )}
                </div>
                </CardContent>
            </GlowingCard>
        </div>
      </div>
    </PageContainer>
  );
}

import { PageContainer } from '@/components/shared/page-container';
