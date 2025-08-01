import { PageHeader } from '@/components/shared/page-header';
import { GlowingCard } from '@/components/shared/glowing-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockPharmacist, mockPharmacistPrescriptions } from '@/lib/data';
import { ClipboardCheck, PackageX, AlertTriangle, MessageSquare, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function PharmacistDashboard() {
  const pendingPrescriptions = mockPharmacistPrescriptions.filter(p => p.status === 'Pending').length;
  const outOfStock = mockPharmacistPrescriptions.filter(p => p.status === 'Out of Stock').length;

  return (
    <div className="animate-fade-in-up space-y-6">
      <PageHeader
        title="Pharmacy Command Center"
        description={`Welcome, ${mockPharmacist.name}. Let's get these prescriptions fulfilled.`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Message Doctor</Button>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Batch</Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPrescriptions}</div>
            <p className="text-xs text-muted-foreground">Waiting for fulfillment</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ready for Pickup</CardTitle>
            <PackageX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPharmacistPrescriptions.filter(p => p.status === 'Ready for Pickup').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting patient collection</p>
          </CardContent>
        </GlowingCard>
        <GlowingCard>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">Items marked out of stock</p>
          </CardContent>
        </GlowingCard>
      </div>

      <GlowingCard>
        <CardHeader>
          <CardTitle>Live Prescription Queue</CardTitle>
          <CardDescription>Most recent incoming prescriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPharmacistPrescriptions.slice(0, 5).map(rx => (
                <TableRow key={rx.id}>
                  <TableCell>{rx.patientName}</TableCell>
                  <TableCell>{rx.medication}</TableCell>
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
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/pharmacist/prescriptions">View</Link>
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
