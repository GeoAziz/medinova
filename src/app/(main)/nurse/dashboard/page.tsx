import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockNurseAssignedPatients, mockNurseTasks } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Users, ClipboardList, AlertTriangle, MessageSquare, Bot } from 'lucide-react';

export default function NurseDashboard() {
  const pendingTasks = mockNurseTasks.filter(t => !t.isCompleted).length;
  const criticalAlerts = mockNurseAssignedPatients.filter(p => p.condition === 'Critical').length;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Nurse Command Center"
        description="Welcome, Nurse Kai. Here is your shift overview."
        actions={<Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Message Doctor</Button>}
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Assigned Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockNurseAssignedPatients.length}</div>
                <p className="text-xs text-muted-foreground">Currently under your care</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
                 <p className="text-xs text-muted-foreground">To be completed this shift</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{criticalAlerts}</div>
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
                        <TableHead>Vitals</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {mockNurseAssignedPatients.map(patient => (
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
                           HR: {patient.vitals.hr} | BP: {patient.vitals.bp}
                        </TableCell>
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
                <CardTitle>Task List</CardTitle>
                <CardDescription>Prioritized tasks for your shift.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {mockNurseTasks.slice(0, 5).map(task => (
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
                    ))}
                </div>
                </CardContent>
            </GlowingCard>
        </div>
      </div>
    </div>
  );
}
