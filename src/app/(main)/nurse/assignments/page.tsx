
import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Search, User, FileText } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/actions/auth.actions';
import { getDetailedPatientAssignments } from '@/lib/actions/nurse-dashboard.actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function NurseAssignmentsPage({ searchParams }: { searchParams?: { query?: string; } }) {
  const user = await getAuthenticatedUser();
  if (!user || user.role !== 'nurse') {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unauthorized</AlertTitle>
            <AlertDescription>You do not have permission to view this page.</AlertDescription>
        </Alert>
    );
  }
  
  const query = searchParams?.query || '';
  const patients = await getDetailedPatientAssignments(user.uid, query);

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Patient Assignments"
        description="Detailed view of all patients currently under your care."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Roster</CardTitle>
              <CardDescription>
                You have {patients.length} patients assigned in your ward.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <form>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name, room, or condition..." className="pl-9" name="query" defaultValue={query} />
                </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           {patients.length === 0 ? (
              <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No patients found. Try adjusting your search.</p>
              </div>
           ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Vitals (HR | BP)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {patients.map(patient => (
                    <TableRow key={patient.id}>
                    <TableCell>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">{patient.id}</div>
                    </TableCell>
                    <TableCell>{patient.room}</TableCell>
                    <TableCell>
                        <Badge variant={patient.condition === 'Critical' ? 'destructive' : patient.condition === 'Needs Monitoring' ? 'secondary' : 'default'}
                                className={patient.condition === 'Stable' ? 'bg-green-600/80' : ''}>
                            {patient.condition}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                        {patient.vitals ? `HR: ${patient.vitals.hr} | BP: ${patient.vitals.bp}` : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline"><User className="h-4 w-4" /></Button>
                            <Button size="icon" variant="outline"><FileText className="h-4 w-4" /></Button>
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
           )}
        </CardContent>
      </GlowingCard>
    </div>
  );
}
