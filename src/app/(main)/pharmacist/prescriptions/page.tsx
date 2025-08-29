import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Check, X, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getPharmacistDashboardData } from '@/lib/actions/pharmacist-dashboard.actions';

export default async function PharmacistPrescriptionsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';
  const { allPrescriptions } = await getPharmacistDashboardData(query);
  
  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Prescription Queue"
        description="Search, view, and manage all incoming prescriptions."
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Prescriptions</CardTitle>
              <CardDescription>
                {allPrescriptions.length} total prescriptions found for the current query.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
                <form>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by patient, drug, or doctor..." className="pl-9" name="query" defaultValue={query} />
                </form>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPrescriptions.length > 0 ? allPrescriptions.map(rx => (
                  <TableRow key={rx.id}>
                    <TableCell>
                      <div className="font-medium">{rx.patientName}</div>
                      <div className="text-xs text-muted-foreground">{rx.patientId}</div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{rx.medication}</div>
                        <div className="text-xs text-muted-foreground">{rx.dosage}</div>
                    </TableCell>
                    <TableCell>{rx.requestingDoctor}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          rx.status === 'Pending' ? 'destructive' :
                          rx.status === 'Ready for Pickup' ? 'secondary' :
                          rx.status === 'Fulfilled' ? 'default' : 'outline'
                        }
                        className={rx.status === 'Fulfilled' ? 'bg-green-600/80' : ''}
                      >
                        {rx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button size="icon" variant="outline" disabled={rx.status !== 'Pending'}>
                                <Check className="h-4 w-4" />
                            </Button>
                             <Button size="icon" variant="outline" disabled={rx.status !== 'Pending'}>
                                <X className="h-4 w-4" />
                            </Button>
                             <Button size="icon" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No prescriptions found.
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
