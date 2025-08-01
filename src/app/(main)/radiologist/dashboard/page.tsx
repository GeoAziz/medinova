import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockRadiologist, mockScanRequests } from '@/lib/data';
import { FileClock, Scan, CheckCircle2, Bot, Upload } from 'lucide-react';
import Link from 'next/link';

export default function RadiologistDashboard() {
  const pendingScans = mockScanRequests.filter(s => s.status === 'Pending').length;
  const reviewedToday = mockScanRequests.filter(s => s.status === 'Reviewed').length; // Mock data

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Radiology Command Center"
        description={`Welcome, ${mockRadiologist.name}. Here are the latest scan requests.`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Bot className="mr-2 h-4 w-4" /> AI Assist</Button>
            <Button asChild><Link href="/radiologist/upload"><Upload className="mr-2 h-4 w-4" /> Upload Scan</Link></Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Scans</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingScans}</div>
            <p className="text-xs text-muted-foreground">Awaiting review and report</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedToday}</div>
            <p className="text-xs text-muted-foreground">Sent to referring doctors</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockScanRequests.length}</div>
            <p className="text-xs text-muted-foreground">Across all imaging types</p>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Scan Request Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Scan Type</TableHead>
                <TableHead>Requesting Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
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
                  <TableCell>{scan.requestingDoctor}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={scan.status === 'Reviewed' ? 'default' : scan.status === 'Pending' ? 'secondary' : 'destructive'}
                      className={scan.status === 'Reviewed' ? 'bg-green-600/80' : ''}
                    >
                      {scan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/radiologist/review">Review</Link>
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
