import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAdmin, mockDoctorApplications, mockUserList, mockSystemLogs } from '@/lib/data';
import { AreaChart, Check, Users, X } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, AreaChart as RechartsAreaChart, CartesianGrid, XAxis } from '@/components/ui/chart';

const chartData = [
  { month: 'January', users: 186 },
  { month: 'February', users: 305 },
  { month: 'March', users: 237 },
  { month: 'April', users: 73 },
  { month: 'May', users: 209 },
  { month: 'June', users: 214 },
];
const chartConfig = { users: { label: "New Users", color: "hsl(var(--primary))" }};

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title={`Admin Console`}
        description={`Welcome, ${mockAdmin.name}. System status is nominal.`}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
             <CardHeader>
              <CardTitle>Doctor Applications</CardTitle>
              <CardDescription>Review and approve pending doctor registrations.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockDoctorApplications.map(app => (
                            <TableRow key={app.id}>
                                <TableCell>{app.name}</TableCell>
                                <TableCell>{app.specialty}</TableCell>
                                <TableCell>{app.date}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-400"><Check className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400"><X className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </GlowingCard>

          <GlowingCard>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Registered</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockUserList.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell><Badge variant={user.role === 'Doctor' ? 'default' : user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></TableCell>
                                <TableCell>{user.registered}</TableCell>
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
              <CardTitle>Platform Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                    <div>
                        <p className="text-2xl font-bold">1,245</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold">3,480</p>
                        <p className="text-sm text-muted-foreground">Appointments</p>
                    </div>
                </div>
                <ChartContainer config={chartConfig} className="h-[150px] w-full">
                    <RechartsAreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: -10 }}>
                        <defs><linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/></linearGradient></defs>
                        <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <AreaChart type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="url(#fillUsers)" />
                    </RechartsAreaChart>
                </ChartContainer>
            </CardContent>
          </GlowingCard>
           <GlowingCard>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2 text-sm font-mono">
                    {mockSystemLogs.map(log => (
                        <p key={log.id} className="text-xs">
                            <span className={log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-yellow-500' : 'text-primary'}>
                                [{log.level}]
                            </span>
                            <span className="text-muted-foreground/50 mx-2">{log.timestamp}</span>
                            <span>{log.message}</span>
                        </p>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </GlowingCard>
        </div>
      </div>
    </div>
  );
}
