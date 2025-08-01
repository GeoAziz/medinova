import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockScanRequests } from '@/lib/data';
import { Search, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function RadiologistHistoryPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Scan Archive"
        description="Search and view historical imaging reports."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Log</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archived Scans</CardTitle>
              <CardDescription>
                A complete log of all reviewed and archived scans.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient, doctor, or scan ID..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Scan Type</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockScanRequests.map(scan => (
                  <TableRow key={scan.id}>
                    <TableCell>
                      <div className="font-medium">{scan.patientName}</div>
                      <div className="text-xs text-muted-foreground">{scan.patientId}</div>
                    </TableCell>
                    <TableCell>{scan.scanType}</TableCell>
                    <TableCell>{scan.requestDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={scan.status === 'Reviewed' ? 'default' : scan.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={scan.status === 'Reviewed' ? 'bg-green-600/80' : ''}
                      >
                        {scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">View Report</Button>
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
