import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockAccessRequests } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search, Check, X, ShieldQuestion } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MRORequestsPage() {
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
                {mockAccessRequests.length} total requests in the system.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by user, patient, or role..." className="pl-9" />
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAccessRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.requestingUser}</div>
                      <div className="text-xs text-muted-foreground">{req.requestingRole}</div>
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
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" disabled={req.status !== 'Pending'}>
                                <Check className="h-4 w-4" />
                            </Button>
                             <Button size="icon" variant="outline" disabled={req.status !== 'Pending'}>
                                <X className="h-4 w-4" />
                            </Button>
                             <Button size="icon" variant="outline">
                                <ShieldQuestion className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
