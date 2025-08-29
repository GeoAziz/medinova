import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getMroDashboardData } from '@/lib/actions/mro-dashboard.actions';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { FileSearch, UserCheck, ShieldCheck, Bot } from 'lucide-react';
import Link from 'next/link';

export default async function MRODashboard() {
  const user = await getAuthenticatedUser();
  const { accessRequests, pendingRequestsCount } = await getMroDashboardData();

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="MRO Command Center"
        description={`Welcome, ${user?.fullName || 'Officer'}. All systems secure.`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Bot className="mr-2 h-4 w-4" /> Activate RecordsCore</Button>
            <Button asChild><Link href="/medical-records/search"><FileSearch className="mr-2 h-4 w-4" /> Search Records</Link></Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequestsCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review and approval</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Records Released Today</CardTitle>
            <FileSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">To authorized personnel (mock)</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nominal</div>
            <p className="text-xs text-muted-foreground">No compliance alerts (mock)</p>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Live Access Request Queue</CardTitle>
          <CardDescription>Most recent incoming requests for patient records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requesting User</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRequests.length > 0 ? accessRequests.slice(0, 5).map(req => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="font-medium">{req.requestingUserName}</div>
                    <div className="text-xs text-muted-foreground">{req.requestingUserRole}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{req.patientName}</div>
                    <div className="text-xs text-muted-foreground">{req.patientId}</div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        req.status === 'Pending' ? 'destructive' :
                        req.status === 'Approved' ? 'default' : 'secondary'
                      }
                      className={req.status === 'Approved' ? 'bg-green-600/80' : ''}
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/medical-records/requests">Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">No access requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
