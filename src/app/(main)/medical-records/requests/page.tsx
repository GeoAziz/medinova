
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMroDashboardData } from '@/lib/actions/mro-dashboard.actions';
import { AccessRequestActions } from '@/components/admin/access-request-actions';

export default async function MRORequestsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';
  const { accessRequests } = await getMroDashboardData(query);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Record Access Requests"
        description="Review, approve, or deny requests for patient data."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Access Requests</CardTitle>
              <CardDescription>
                {accessRequests.length} total requests in the system.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <form>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by user or patient name..." className="pl-9" name="query" defaultValue={query} />
                </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requesting User</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessRequests.length > 0 ? accessRequests.map(req => (
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
                    <TableCell>{req.date}</TableCell>
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
                    <TableCell className="text-right">
                        <AccessRequestActions requestId={req.id} patientId={req.patientId} status={req.status} />
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No access requests found for the current search query.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
