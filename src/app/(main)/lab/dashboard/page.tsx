import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockLabTests } from '@/lib/data';
import { Beaker, FlaskConical, CheckCircle2, AlertTriangle, PlayCircle, BarChart, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function LabDashboard() {
  const pendingTests = mockLabTests.filter(t => t.status === 'Pending').length;
  const completedToday = mockLabTests.filter(t => t.status === 'Completed').length; // Mock data
  const rejectedSamples = mockLabTests.filter(t => t.status === 'Rejected').length;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Lab Command Center"
        description="Welcome, Lab Scientist 04. Review and process incoming test requests."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link href="/lab/analytics"><BarChart className="mr-2 h-4 w-4" /> View Analytics</Link></Button>
            <Button asChild><Link href="/lab/workbench"><PlayCircle className="mr-2 h-4 w-4" /> Process Sample</Link></Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests In Queue</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTests}</div>
            <p className="text-xs text-muted-foreground">New samples awaiting processing</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground">Results submitted to doctors</p>
          </CardContent>
        </GlowingCard>
         <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rejected Samples</CardTitle>
            <XCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedSamples}</div>
            <p className="text-xs text-muted-foreground">Contaminated or invalid samples</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Results flagged for immediate review</p>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Incoming Test Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test Type</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLabTests.map(test => (
                <TableRow key={test.id}>
                  <TableCell>{test.id}</TableCell>
                  <TableCell>{test.patientName}</TableCell>
                  <TableCell>{test.testType}</TableCell>
                  <TableCell>{test.requestingDoctor}</TableCell>
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
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/lab/workbench">Process</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlowingCard>
    </div>
  );
}
