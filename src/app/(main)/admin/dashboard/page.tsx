
// src/app/(main)/admin/dashboard/page.tsx
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Send, AlertTriangle, Users, Stethoscope, Pill, Beaker } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { adminDb } from '@/lib/firebase-admin';

// Helper function to get data using the Admin SDK
async function getUsers() {
    const usersSnapshot = await adminDb.collection('users').orderBy('fullName').get();
    const userList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.fullName,
            role: data.role,
            registered: data.createdAt.toDate().toLocaleDateString(),
        };
    });
    return userList;
}

async function getSystemLogs() {
    const logSnapshot = await adminDb.collection('systemLogs').orderBy('timestamp', 'desc').limit(10).get();
    const logList = logSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            level: data.level.toUpperCase(),
            timestamp: data.timestamp.toDate().toLocaleString(),
            message: data.message,
        };
    });
    return logList;
}

async function getRoleCounts() {
    const roles = ['patient', 'doctor', 'nurse', 'pharmacist'];
    const counts: { [key: string]: number } = {};
    for (const role of roles) {
        // NOTE: In a real large-scale app, this would be inefficient.
        // You would typically maintain counters in a separate document.
        const snapshot = await adminDb.collection('users').where('role', '==', role).get();
        counts[role] = snapshot.size;
    }
    return counts;
}


export default async function AdminDashboard() {
  const users = await getUsers();
  const systemLogs = await getSystemLogs();
  const roleCounts = await getRoleCounts();

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title={`Admin Command Center`}
        description={`Welcome, SysAdmin. All systems operational.`}
        actions={
            <div className="flex gap-2">
                <Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Create User</Button>
                <Button><Send className="mr-2 h-4 w-4" /> Broadcast Message</Button>
            </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{roleCounts['patient'] ?? 0}</div>
                <p className="text-xs text-muted-foreground">Active patient records</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{roleCounts['doctor'] ?? 0}</div>
                 <p className="text-xs text-muted-foreground">Verified medical staff</p>
            </CardContent>
        </GlowingCard>
         <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Nurses</CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{roleCounts['nurse'] ?? 0}</div>
                 <p className="text-xs text-muted-foreground">Active nursing staff</p>
            </CardContent>
        </GlowingCard>
        <GlowingCard>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">System Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{systemLogs.filter(l => l.level === 'ERROR').length}</div>
                <p className="text-xs text-muted-foreground">In the last 10 logs</p>
            </CardContent>
        </GlowingCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users in the MediVerse.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Registered</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell><Badge variant={user.role === 'doctor' ? 'default' : user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role}</Badge></TableCell>
                                    <TableCell>{user.registered}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
          </GlowingCard>
        </div>

        <div className="space-y-6">
          <GlowingCard>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Live feed of system activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <div className="space-y-4">
                        {systemLogs.map(log => (
                            <div key={log.id} className="text-xs">
                                <span className={
                                    log.level === 'ERROR' ? 'text-destructive' :
                                    log.level === 'WARN' ? 'text-yellow-500' : 'text-primary'
                                }>{log.level}</span>
                                <span className="text-muted-foreground mx-2">{log.timestamp}</span>
                                <p className="text-foreground">{log.message}</p>
                            </div>
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
