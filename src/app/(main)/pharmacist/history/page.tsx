import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockPharmacistPrescriptions } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PharmacistHistoryPage() {
    const fulfilledPrescriptions = mockPharmacistPrescriptions.filter(p => p.status === 'Fulfilled');

  return (
    <div className="animate-fade-in-up">
      <PageHeader
        title="Dispensation Records"
        description="Search and view historical dispensation records."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Log</Button>}
      />
      <GlowingCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Archived Prescriptions</CardTitle>
              <CardDescription>
                A complete log of all fulfilled prescriptions.
              </CardDescription>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by patient, drug, or doctor..." className="pl-9" />
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
                  <TableHead>Fulfilled Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fulfilledPrescriptions.map(rx => (
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
                    <TableCell>{rx.receivedDate}</TableCell>
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
