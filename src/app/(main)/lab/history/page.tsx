import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockLabTests } from '@/lib/data';
import { Search, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LabHistoryPage() {
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Test Archives"
        description="Search and view historical test results."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archived Lab Tests</CardTitle>
              <CardDescription>
                A complete log of all processed samples.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient, test ID, or type..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLabTests.map(test => (
                  <TableRow key={test.id}>
                    <TableCell>{test.id}</TableCell>
                     <TableCell>
                      <div className="font-medium">{test.patientName}</div>
                      <div className="text-xs text-muted-foreground">{test.patientId}</div>
                    </TableCell>
                    <TableCell>{test.testType}</TableCell>
                    <TableCell>{test.receivedDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          test.status === 'Completed' ? 'default' : 
                          test.status === 'In Progress' ? 'secondary' : 
                          test.status === 'Rejected' ? 'outline' : 'destructive'
                        }
                        className={test.status === 'Completed' ? 'bg-green-600/80' : ''}
                      >
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm"><FileText className="mr-2 h-4 w-4"/>View Report</Button>
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
