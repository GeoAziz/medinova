import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileClock, Scan, CheckCircle2, Bot, Upload, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getRadiologistDashboardData } from '@/lib/actions/radiologist-dashboard.actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default async function RadiologistDashboard() {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'radiologist') {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
    );
  }

  const { allScans, pendingCount, reviewedTodayCount } = await getRadiologistDashboardData();

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Radiology Command Center"
        description={`Welcome, ${user.fullName}. Here are the latest scan requests.`}
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
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review and report</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedTodayCount}</div>
            <p className="text-xs text-muted-foreground">Sent to referring doctors</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans Today</CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allScans.length}</div>
            <p className="text-xs text-muted-foreground">Across all imaging types</p>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Scan Request Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {allScans.length > 0 ? (
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
                {allScans.slice(0, 10).map(scan => (
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Scan className="mx-auto h-12 w-12 mb-4" />
              <p>The scan queue is currently empty.</p>
            </div>
          )}
        </CardContent>
      </GlowingCard>
    </PageContainer>
  );
}

import { PageContainer } from '@/components/shared/page-container';
